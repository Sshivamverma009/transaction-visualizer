import mongoose, { Document, Model, Schema } from "mongoose";

export enum Category {
  Food = "Food",
  Transport = "Transport",
  Utilities = "Utilities",
  Entertainment = "Entertainment",
  Other = "Other",
}

export interface ITransaction extends Document {
  amount: number;
  date: Date;
  description: string;
  category: Category;
}

export interface IMonthlyExpense extends Document {
  month: Date;
  budget: number;
  actualExpense: number;
  categoricalExpense: {
    category: Category;
    amount: number;
  }[];
}

const TransactionSchema: Schema<ITransaction> = new Schema(
  {
    amount: { type: Number, required: true, default: 0 },
    date: { type: Date, required: true, default: Date.now },
    description: { type: String, maxLength: 200 },
    category: {
      type: String,
      enum: Object.values(Category),
      default: Category.Other,
      required: true,
    },
  },
  { timestamps: true }
);

const ExpenseSchema: Schema<IMonthlyExpense> = new Schema(
  {
    month: {
      type: Date,
      required: true,
      default: () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    },
    budget: { type: Number, default: 0 },
    actualExpense: { type: Number, default: 0 },
    categoricalExpense: [
      {
        category: {
          type: String,
          enum: Object.values(Category),
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Transaction =
  mongoose.models.Transaction as Model<ITransaction> ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);

export const Expense =
  mongoose.models.Expense as Model<IMonthlyExpense> ||
  mongoose.model<IMonthlyExpense>("Expense", ExpenseSchema);
