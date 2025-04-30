import mongoose, { Document, Model, Schema } from "mongoose";

enum Category {
  Food = "Food",
  Transport = "Transport",
  Utilities = "Utilities",
  Entertainment = "Entertainment",
  Other = "Other",
}

interface Transaction extends Document {
  amount: number;
  date: Date;
  description: string;
  category: Category;
}

interface MonthlyExpense extends Document {
  month: Date;
  budget: number;
  actualExpense: number;
  categoricalExpense: { category: Category; amount: number }[];
}

const TransactionSchema: Schema<Transaction> = new Schema({
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  description: {
    type: String,
    maxLength: 200,
  },
  category: {
    type: String,
    enum: Object.values(Category),
    default: Category.Other,
  },
});

const ExpenseSchema: Schema<MonthlyExpense> = new Schema({
  month: {
    type: Date,
    required: true,
    default: Date.now,
  },
  budget: {
    type: Number,
    default : 0,
  },
  actualExpense: {
    type: Number,
    default: 0,
  },

  categoricalExpense: {
    type: [{
      category: {
        type: String,
        enum: Object.values(Category),
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
    }],
    required: true,
  },
});

export const Transaction =
  (mongoose.models.Transaction as Model<Transaction>) ||
  mongoose.model<Transaction>("Transaction", TransactionSchema);

export const Expense =
  (mongoose.models.Expense as Model<MonthlyExpense>) ||
  mongoose.model<MonthlyExpense>("Expense", ExpenseSchema);


