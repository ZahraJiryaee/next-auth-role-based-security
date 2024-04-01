import mongoose, { Schema } from "mongoose";

// mongoose.connect(process.env.MONGODB_URI);
const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to myDB");
};

run().catch((err) => console.error("mongoose connect error", err));

mongoose.Promise = global.Promise;

const userSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
