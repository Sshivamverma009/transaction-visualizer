import { database } from "@/lib/dbConnect";
import {Transaction, Expense} from "@/models/models";
import { NextRequest, NextResponse } from "next/server";
import { startOfMonth } from "date-fns";

export async function POST(req: NextRequest) {
  try {
    await database();

    const { amount, date, description, category } = await req.json();

    if (!amount) {
      console.log("Amount is Requied to add Transaction");
      return NextResponse.json(
        { message: "Amount is required" },
        { status: 400 }
      );
    }

    const newTransaction = await Transaction.create({
      amount,
      date,
      description,
      category,
    });

    const monthStart = startOfMonth(new Date(date));

    // 2. Try to update existing category in categoricalExpense array
    const updated = await Expense.updateOne(
      {
        month: monthStart,
        "categoricalExpense.category": category,
      },
      {
        $inc: {
          actualExpense: amount,
          "categoricalExpense.$.amount": amount, // positional operator
        },
      }
    );

    if (updated.modifiedCount === 0) {
      await Expense.findOneAndUpdate(
        { month: monthStart },
        {
          $inc: { actualExpense: amount },
          $push: {
            categoricalExpense: { category, amount },
          },
        },
        { upsert: true }
      );
    }
    
    console.log(newTransaction);
    console.log("transaction created successfully");
    return NextResponse.json(
      { message: "transaction created successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Error :: ", error.message);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
