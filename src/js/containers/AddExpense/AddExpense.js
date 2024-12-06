import React, { useState } from "react"
import { useNavigate } from "@tata1mg/router"
import "./styles.css"

const AddExpense = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: 'food',
        timestamp: new Date().toISOString().split('T')[0]
    });

    const categories = [
        { value: 'food', label: 'Food' },
        { value: 'transport', label: 'Transport' },
        { value: 'utilities', label: 'Utilities' },
        { value: 'entertainment', label: 'Entertainment' },
        { value: 'shopping', label: 'Shopping' },
        { value: 'health', label: 'Health & Medical' },
        { value: 'sports', label: 'Sports & Fitness' },
        { value: 'bills', label: 'Bills & Rent' },
        { value: 'education', label: 'Education' },
        { value: 'travel', label: 'Travel' },
        { value: 'gifts', label: 'Gifts & Donations' },
        { value: 'electronics', label: 'Electronics' },
        { value: 'clothing', label: 'Clothing' },
        { value: 'pets', label: 'Pets' },
        { value: 'other', label: 'Other' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser || !currentUser.id) {
                throw new Error('Please log in to add expenses');
            }

            const response = await fetch('/api/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': currentUser.id
                },
                body: JSON.stringify({
                    description: formData.description.trim(),
                    amount: Number(formData.amount),
                    category: formData.category,
                    timestamp: new Date(formData.timestamp).toISOString()
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save expense');
            }

            navigate('/');
        } catch (error) {
            console.error('Error saving expense:', error);
            alert(error.message || 'Failed to save expense. Please try again.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="container">
            <header className="header">
                <div className="headerContent">
                    <h1 className="title">Add New Expense</h1>
                    <p className="subtitle">Track your spending by adding a new expense</p>
                </div>
            </header>

            <div className="card">
                <form onSubmit={handleSubmit} className="form">
                    <div className="formGroup">
                        <label htmlFor="description">Description</label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="What did you spend on?"
                            required
                        />
                    </div>

                    <div className="formGroup">
                        <label htmlFor="amount">Amount (₹)</label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="How much did you spend?"
                            min="0"
                            required
                        />
                    </div>

                    <div className="formGroup">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            {categories.map(cat => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="formGroup">
                        <label htmlFor="date">Date</label>
                        <input
                            type="date"
                            id="date"
                            name="timestamp"
                            value={formData.timestamp}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="buttonGroup">
                        <button 
                            type="button" 
                            onClick={() => navigate('/')} 
                            className="cancelBtn"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="addBtn"
                        >
                            Add Expense
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExpense; 