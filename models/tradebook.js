import mongoose from "mongoose";

const { Schema } = mongoose;

const tradeBookSchema = new Schema({
    username:String,
    password:String,
});

const tradebook = mongoose.model('tradebook', tradeBookSchema);

export default tradebook;