import { database } from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { Expense } from "@/models/models";

export async function GET(req: NextRequest) {
  try {
    await database();

    const response = await Expense.find().select("categoricalExpense");

    console.log("response :", response);
    return NextResponse.json({ response: response }, { status: 200 });
  } catch (error: any) {
    console.log("Error :", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
