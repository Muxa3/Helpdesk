import mongoose from "mongoose";

const bazaznaniySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    }
});

export default mongoose.model("Bazaznaniy", bazaznaniySchema); 