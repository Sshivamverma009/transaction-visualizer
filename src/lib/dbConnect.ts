import mongoose from "mongoose";

type connectionObject = {
  isConnected?: number;
};

const connection: connectionObject = {};

export const database = async (): Promise<void> => {
  try {
    if (connection.isConnected) {
      console.log("DB already Connected");
      return;
    }
    const response = await mongoose.connect(
      `${process.env.DATABASE_URL}/finance_visualizer`
    );

    connection.isConnected = response.connections[0].readyState;

    console.log("DB connected succussfully");
    return;
  } catch (error: any) {
    console.log("Error ::", error.message);
    process.exit(1);
  }
};
