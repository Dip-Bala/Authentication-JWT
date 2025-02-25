import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: {
    type : String,
    required: [true, "Email is required"],
    unique : true,
    index: true,
  },
  password: {
    type : String,
    required: [true, "Password is required"]
  }

});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // Prevent re-hashing if not modified
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();  // Call next() to proceed
});

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw Error("Incorrect Email");

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) throw Error("Incorrect Password");

    return user;
};


const Users = model('Users', userSchema);
export default Users;