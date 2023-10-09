import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
    username:String,
    password:String,
});

const user = mongoose.model('User', userSchema);

export default user;