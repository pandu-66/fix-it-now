const mongoose = require('mongoose');
const {Schema} = mongoose;

const issueSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    urgency: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    status: {
        type: String, 
        enum: ['pending', 'in-progress', 'resolved', 'rejected'], 
        default: 'pending' 
    },
    category: {
        type: String,
        enum: ['plumber', 'electrician', 'carpenter', 'painter', 'technician', 'other'],
        required: true
    },
    residentId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    providerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    selectedOpt: {
        type: String,
        enum: ['yes', 'no'],
        required: true
    },
    completedAt: {
        type: Date,
        default: null
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    }
}, {timestamps: true});

const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;