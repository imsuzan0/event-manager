import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Fullname is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validator: {
        validator: function(value){
          if(value){
            return validator.isEmail(value)
          }
          return true;
        },
        message: 'Please provide a valid email'
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    profilePic: {
      type: String,
      optional: true,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};


export const User = mongoose.model("User", userSchema);