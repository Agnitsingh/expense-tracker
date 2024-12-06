const express = require('express');
const connectDB = require('./db');
const expenseController = require('./controllers/expense.controller');
const authRoutes = require('./routes/auth');

// Middleware to extract user ID from headers
const extractUserId = (req, res, next) => {
    const userId = req.headers['user-id'];
    if (!userId) {
        return res.status(401).json({ message: 'User ID not provided' });
    }
    req.userId = userId;
    next();
};

exports.addMiddlewares = function(app) {
    // Connect to MongoDB
    connectDB().catch(console.error);

    // Middleware
    app.use(express.json());

    // Auth routes
    app.use('/api/auth', authRoutes);

    // Expense routes with user ID extraction
    app.get('/api/expenses', extractUserId, expenseController.getExpenses);
    app.post('/api/expenses', extractUserId, expenseController.createExpense);
    app.put('/api/expenses/:id', extractUserId, expenseController.updateExpense);
    app.delete('/api/expenses/:id', extractUserId, expenseController.deleteExpense);
}
