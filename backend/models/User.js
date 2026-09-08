import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // Security: Direct queries mein password hash return nahi hoga
    },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
    phone: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash Password before saving to database
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   // next();
// });

// Compare Entered Password with Hashed Password
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

const User = mongoose.model("User", userSchema);
export default User;