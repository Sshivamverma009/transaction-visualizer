import { database } from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { Expense } from "@/models/models";

export async function GET(req: NextRequest) {
  try {
    await database();

    const expenses = await Expense.find().select("categoricalExpense");

    return NextResponse.json({ expenses }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
