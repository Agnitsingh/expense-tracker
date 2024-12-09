const express = require('express');
const connectDB = require('./db');
const expenseController = require('./controllers/expense.controller');
const authRoutes = require('./routes/auth');

const extractUserId = (req, res, next) => {
    const userId = req.headers['user-id'];
    if (!userId) {
        return res.status(401).json({ message: 'User ID not provided' });
    }
    req.userId = userId;
    next();
};

exports.addMiddlewares = function(app) {
    connectDB().catch(console.error);

    app.use(express.json());

    app.use('/api/auth', authRoutes);

    app.get('/api/expenses', extractUserId, expenseController.getExpenses);
    app.post('/api/expenses', extractUserId, expenseController.createExpense);
    app.put('/api/expenses/:id', extractUserId, expenseController.updateExpense);
    app.delete('/api/expenses/:id', extractUserId, expenseController.deleteExpense);
}
