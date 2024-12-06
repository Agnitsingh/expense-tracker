const Expense = require('./expense.model');

// Get all expenses for a user
exports.getExpenses = async (req, res) => {
    try {
        console.log('Getting expenses for user ID:', req.userId); // Debug log

        const expenses = await Expense.find({ userId: req.userId })
            .sort({ timestamp: -1 });

        console.log('Found expenses:', expenses); // Debug log

        const total = await Expense.aggregate([
            { $match: { userId: req.userId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        
        console.log('Total amount:', total[0]?.total || 0); // Debug log

        res.json({
            expenses,
            totalAmount: total[0]?.total || 0
        });
    } catch (error) {
        console.error('Error getting expenses:', error);
        res.status(500).json({ message: error.message });
    }
};

// Create a new expense
exports.createExpense = async (req, res) => {
    try {
        console.log('Creating expense for user ID:', req.userId); // Debug log
        console.log('Expense data:', req.body); // Debug log

        const expense = new Expense({
            ...req.body,
            userId: req.userId
        });
        const savedExpense = await expense.save();

        console.log('Saved expense:', savedExpense); // Debug log

        res.status(201).json(savedExpense);
    } catch (error) {
        console.error('Error creating expense:', error);
        res.status(400).json({ message: error.message });
    }
};

// Update an expense
exports.updateExpense = async (req, res) => {
    try {
        console.log('Updating expense:', req.params.id, 'for user:', req.userId); // Debug log

        const expense = await Expense.findOne({ 
            _id: req.params.id,
            userId: req.userId 
        });

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        Object.assign(expense, req.body);
        const updatedExpense = await expense.save();

        console.log('Updated expense:', updatedExpense); // Debug log

        res.json(updatedExpense);
    } catch (error) {
        console.error('Error updating expense:', error);
        res.status(400).json({ message: error.message });
    }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
    try {
        console.log('Deleting expense:', req.params.id, 'for user:', req.userId); // Debug log

        const expense = await Expense.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        console.log('Deleted expense:', expense); // Debug log

        res.json({ message: 'Expense deleted' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: error.message });
    }
}; 