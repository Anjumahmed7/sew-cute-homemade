// import mongoose from "mongoose";
// import bcrypt from "bcrypt";

// const userSchema = new mongoose.Schema(
//   {
//     fullName: { type: String, required: true, trim: true },
//     email: {
//       type: String,
//       required: true,
//       unique: true, // <-- this alone is enough
//       lowercase: true,
//       trim: true,
//     },
//     password: { type: String, required: true, minlength: 6, select: false },
//     role: { type: String, enum: ["user", "admin"], default: "user" },
//     addresses: [
//       {
//         label: String,
//         line1: String,
//         city: String,
//         region: String,
//         postalCode: String,
//         country: String,
//         phone: String,
//       },
//     ],
//   },
//   { timestamps: true } // ✅ correct option
// );

// // ❌ remove this duplicate line!
// // userSchema.index({ email: 1 }, { unique: true });

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// const Users = mongoose.model("Users", userSchema);
// export default Users;

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true, // let Mongoose build the unique index
      lowercase: true, // normalize on write
      trim: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    addresses: [
      {
        label: String,
        line1: String,
        city: String,
        region: String,
        postalCode: String,
        country: String,
        phone: String,
      },
    ],
  },
  { timestamps: true } // (NOT "timeseries")
);

// Do NOT also add userSchema.index({ email:1 }, { unique:true }) if you keep unique:true above

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

const Users = mongoose.model("Users", userSchema);
export default Users;
