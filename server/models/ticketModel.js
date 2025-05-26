import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['new', 'active', 'closed'],
        default: 'new'
    },
    priorityRating: {
        type: String,
        enum: ['1', '2', '3', '4']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    activatedAt: {
        type: Date,
        default: null
    },
    closedAt: {
        type: Date,
        default: null
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

ticketSchema.methods.updateStatus = async function(newStatus, priorityRating = null) {
    this.status = newStatus;
    if (newStatus === 'active') {
        this.activatedAt = new Date();
        if (priorityRating) {
            this.priorityRating = priorityRating;
        }
    }
    if (newStatus === 'closed') {
        this.closedAt = new Date();
    }
    return this.save();
};

export default mongoose.model("Tickets", ticketSchema); 