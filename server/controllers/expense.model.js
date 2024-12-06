const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: [
            'food',
            'transport',
            'utilities',
            'entertainment',
            'shopping',
            'health',
            'sports',
            'bills',
            'education',
            'travel',
            'gifts',
            'electronics',
            'clothing',
            'pets',
            'other'
        ]
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Expense', expenseSchema); 