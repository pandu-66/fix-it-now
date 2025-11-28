const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["resident", "provider"],
        required: true
    },
    category: {
        type: String,
        enum: ['plumber', 'electrician', 'carpenter', 'painter', 'technician', 'other'],
        required: function () { return this.role === 'provider'; }
    },
    roomNo: {
        type: String,
        required: function() { return this.role === 'resident';}
    },
    averageRating: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },
    totalRating: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;