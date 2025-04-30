import { database } from "@/lib/dbConnect";
import { ObjectId } from "mongoose";
import { Transaction, Expense } from "@/models/models";
import { NextRequest, NextResponse } from "next/server";
import { startOfMonth } from "date-fns";

export async function PUT(req: NextRequest) {
  try {
    await database();

    const { _id, amount, date, description, category } = await req.json();

    console.log(req);

    if (!_id) {
      console.log("Transaction ID is required");
      return NextResponse.json(
        { message: "Transaction ID is required" },
        { status: 400 }
      );
    }
    const oldTransaction = await Transaction.findById(_id);

    if (!oldTransaction) {
      console.log("Transaction not found");
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    const monthStart = startOfMonth(new Date(date));

    await Expense.updateOne(
      {
        month: monthStart,
        "categoricalExpense.category": oldTransaction.category,
      },
      {
        $inc: {
          actualExpense: -oldTransaction.amount,
          "categoricalExpense.$.amount": -oldTransaction.amount,
        },
      }
    );

    await Transaction.findByIdAndUpdate(_id, {
      amount,
      date,
      description,
      category,
    });

    const updated = await Expense.updateOne(
      { month: monthStart, "categoricalExpense.category": category },
      {
        $inc: {
          actualExpense: amount,
          "categoricalExpense.$.amount": amount,
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

    console.log("Transaction and MonthlyExpense updated successfully");
    return NextResponse.json(
      { message: "Transaction and MonthlyExpense updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Error ::", error.message);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
