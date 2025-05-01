import { database } from "@/lib/dbConnect";
import { Transaction, Expense } from "@/models/models";
import { NextRequest, NextResponse } from "next/server";
import { startOfMonth } from "date-fns";

export async function DELETE(req: NextRequest) {
  try {
    await database();

    const { _id } = await req.json();

    if (!_id || typeof _id !== "string") {
      return NextResponse.json(
        { message: "Transaction ID is required" },
        { status: 400 }
      );
    }

    const transaction = await Transaction.findById(_id);

    if (!transaction) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    const { amount, category, date } = transaction;

    await Transaction.findByIdAndDelete(_id);

    const monthStart = startOfMonth(new Date(date));

    const updateResult = await Expense.updateOne(
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

    return NextResponse.json(
      {
        message: updateResult,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
