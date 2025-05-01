import { database } from "@/lib/dbConnect";
import { Transaction } from "@/models/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await database();

    const transactions = await Transaction.find().sort({ date: -1 });

    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
