const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long'],
        trim: true
    },
    number: {
        type: String,
        required: true,
        minlength: [10, 'Number must contain 10 digits'],
        maxlength: [10, 'Number must be exactly 10 digits'],
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    zipcode: {
        type: String,
        required: true,
        minlength: [6, 'Zipcode must contain 6 digits'],
        maxlength: [6, 'Zipcode must be exactly 6 digits'],
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    bookmarks: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Property'
        }],
        default: []
    },
    avatar: {
        type: String
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: {
        type: String,
        default: null,
        select: false
    },
    emailVerificationExpire: {
        type: Date,
        default: null
    }
}, { timestamps: true })

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const user = mongoose.model('User', UserSchema);

module.exports = user;
