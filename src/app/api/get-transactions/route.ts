import { database } from "@/lib/dbConnect";
import {Transaction} from "@/models/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await database();

    const response = await Transaction.find();

    if (!response) {
      console.log("transaction is not fetched successfully");
      return NextResponse.json(
        { message: "transaction is not fetched successfully" },
        { status: 500 }
      );
    }

    console.log("transactions is fetched successfully");
    return NextResponse.json({ transactions: response }, { status: 200 });
  } catch (error: any) {
    console.log("Error :", error.message);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
