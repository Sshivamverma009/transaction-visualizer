import { database } from "@/lib/dbConnect";
import { Transaction, Expense } from "@/models/models";
import { NextRequest, NextResponse } from "next/server";
import { startOfMonth } from "date-fns";

// PUT method
export async function PUT(req: NextRequest) {
  try {
    await database();

    const { _id, amount, date, description, category } = await req.json();

    // Validate the inputs
    if (!_id || !amount || !date || !category) {
      return NextResponse.json(
        { message: "All fields (_id, amount, date, category) are required" },
        { status: 400 }
      );
    }

    // Find the old transaction
    const oldTransaction = await Transaction.findById(_id);

    if (!oldTransaction) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    const monthStart = startOfMonth(new Date(date));

    // Update Expense (subtracting old transaction amount)
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

    // Update the Transaction with new values
    await Transaction.findByIdAndUpdate(_id, {
      amount,
      date,
      description,
      category,
    });

    // Update Expense (adding new transaction amount)
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

    // Send success response
    return NextResponse.json(
      { message: "Transaction and MonthlyExpense updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
