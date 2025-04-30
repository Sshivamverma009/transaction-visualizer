import { database } from "@/lib/dbConnect";
import { ObjectId } from "mongoose";
import { Transaction, Expense } from "@/models/models";
import { NextRequest, NextResponse } from "next/server";
import { startOfMonth } from "date-fns";

export async function DELETE(req: NextRequest) {
  try {
    await database();

    const { _id } = await req.json();

    if (!_id) {
      console.log("Transaction ID not found");
      return NextResponse.json(
        { message: "Transaction ID is required" },
        { status: 400 }
      );
    }
    const transaction = await Transaction.findById(_id);

    if (!transaction) {
      console.log("Transaction not found");
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    const { amount, category, date } = transaction;

    await Transaction.findByIdAndDelete(_id);

    const monthStart = startOfMonth(new Date(date));

    const updated = await Expense.updateOne(
      {
        month: monthStart,
        "categoricalExpense.category": category,
      },
      {
        $inc: {
          actualExpense: -amount,
          "categoricalExpense.$.amount": -amount,
        },
      }
    );
    if (updated.modifiedCount === 0) {
      console.log(
        "Category not found for this month, no changes to MonthlyExpense"
      );
    }

    console.log("Transaction deleted and MonthlyExpense updated successfully");
    return NextResponse.json(
      {
        message: "Transaction deleted and MonthlyExpense updated successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Error ::", error.message);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
