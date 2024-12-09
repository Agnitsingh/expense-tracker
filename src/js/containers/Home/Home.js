import React, { useState, useEffect, useMemo } from "react"
import { useNavigate, useCurrentRouteData } from "@tata1mg/router"
import "./styles.css"

const Home = () => {
    const navigate = useNavigate();
    const { data, refetch } = useCurrentRouteData();
    const [state, setState] = useState({
        expenses: [],
        totalAmount: 0,
        selectedCategory: 'all',
        editingExpense: null,
        showDeleteConfirm: false,
        expenseToDelete: null,
        showPrintView: false
    });

    const [userData, setUserData] = useState({ name: 'there' });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            setUserData(currentUser);
        }
    }, []);

    useEffect(() => {
        if (data) {
            console.log('Received data in Home:', data);
            setState(prev => ({
                ...prev,
                expenses: data.expenses || [],
                totalAmount: data.totalAmount || 0
            }));
        }
    }, [data]);

    const handlePrint = () => {
        setState(prev => ({ ...prev, showPrintView: true }));
        setTimeout(() => {
            window.print();
            setState(prev => ({ ...prev, showPrintView: false }));
        }, 100);
    };

   
    const fetchExpenses = async () => {
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser || !currentUser.id) {
                console.log('No user ID found');
                return;
            }

            console.log('Fetching expenses for user:', currentUser.id);
            const response = await fetch('/api/expenses', {
                headers: {
                    'user-id': currentUser.id
                }
            });

            const responseData = await response.json();
            console.log('Fetched expenses:', responseData);

            setState(prev => ({
                ...prev,
                expenses: responseData.expenses || [],
                totalAmount: responseData.totalAmount || 0
            }));
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

   
    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage?.removeItem('currentUser');
            navigate('/login');
        }
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const handleCategoryChange = (e) => {
        setState(prev => ({ ...prev, selectedCategory: e.target.value }));
    };

    const handleEditClick = (expense) => {
        setState(prev => ({ ...prev, editingExpense: expense }));
    };

    const handleDeleteClick = (expense) => {
        setState(prev => ({
            ...prev,
            expenseToDelete: expense,
            showDeleteConfirm: true
        }));
    };

    const handleDeleteConfirm = async () => {
        if (!state.expenseToDelete) return;

        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser || !currentUser.id) {
                throw new Error('User not logged in');
            }

            console.log('Deleting expense:', state.expenseToDelete._id);
            const response = await fetch(`/api/expenses/${state.expenseToDelete._id}`, {
                method: 'DELETE',
                headers: {
                    'user-id': currentUser.id
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete expense');
            }

            await fetchExpenses();
            setState(prev => ({
                ...prev,
                showDeleteConfirm: false,
                expenseToDelete: null
            }));
        } catch (error) {
            console.error('Error deleting expense:', error);
            alert('Failed to delete expense. Please try again.');
        }
    };

    const handleDeleteCancel = () => {
        setState(prev => ({
            ...prev,
            showDeleteConfirm: false,
            expenseToDelete: null
        }));
    };

    const handleUpdateExpense = async (updatedExpense) => {
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser || !currentUser.id) {
                throw new Error('User not logged in');
            }

            console.log('Updating expense:', updatedExpense);
            const response = await fetch(`/api/expenses/${updatedExpense._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': currentUser.id
                },
                body: JSON.stringify(updatedExpense)
            });

            if (!response.ok) {
                throw new Error('Failed to update expense');
            }

            await fetchExpenses();
            setState(prev => ({
                ...prev,
                editingExpense: null
            }));
        } catch (error) {
            console.error('Error updating expense:', error);
            alert('Failed to update expense. Please try again.');
        }
    };

    const filteredExpenses = useMemo(() => {
        console.log('Current expenses:', state.expenses);
        return state.selectedCategory === 'all' 
            ? state.expenses 
            : state.expenses.filter(exp => exp.category === state.selectedCategory);
    }, [state.expenses, state.selectedCategory]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };

    return (
        <div className={`container ${state.showPrintView ? 'printView' : ''}`}>
            <header className="header">
                <div className="headerContent">
                    <div className="headerTitles">
                        <h1 className="title">Expense Tracker</h1>
                        <p className="subtitle">{getGreeting()}, {userData.name || 'User'}!</p>
                    </div>
                    <div className="headerActions">
                        <button onClick={() => navigate('/add')} className="addButton">
                            <span>Add Expense</span>
                        </button>
                        <button onClick={() => navigate('/analytics')} className="analyticsButton">
                            <span>Analytics</span>
                        </button>
                        <button onClick={handleLogout} className="logoutButton">
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {filteredExpenses.length === 0 ? (
                <div className="noTransactions">
                    <p>No transactions yet. Start tracking your expenses by clicking the Add Expense button above!</p>
                </div>
            ) : (
                <>
                    <div className="summary">
                        <h2>Total Expenses: {formatAmount(state.totalAmount)}</h2>
                        <select 
                            value={state.selectedCategory} 
                            onChange={handleCategoryChange}
                            className="filterSelect"
                        >
                            <option value="all">All Categories</option>
                            <option value="food">Food</option>
                            <option value="transport">Transport</option>
                            <option value="utilities">Utilities</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="shopping">Shopping</option>
                            <option value="health">Health & Medical</option>
                            <option value="sports">Sports & Fitness</option>
                            <option value="bills">Bills & Rent</option>
                            <option value="education">Education</option>
                            <option value="travel">Travel</option>
                            <option value="gifts">Gifts & Donations</option>
                            <option value="electronics">Electronics</option>
                            <option value="clothing">Clothing</option>
                            <option value="pets">Pets</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <ul className="transactionsList">
                        {filteredExpenses.map(expense => (
                            <li key={expense._id} className="transaction">
                                <div className="transactionInfo">
                                    <span className="transactionDescription">
                                        {expense.description}
                                    </span>
                                    <div className="transactionMeta">
                                        <span className="transactionCategory">
                                            {expense.category}
                                        </span>
                                        <span className="transactionDate">
                                            {new Date(expense.timestamp).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short'
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <div className="transactionActions">
                                    <span className="transactionAmount">
                                        {formatAmount(expense.amount)}
                                    </span>
                                    <button 
                                        onClick={() => handleEditClick(expense)}
                                        className="actionButton editButton"
                                        title="Edit expense"
                                    >
                                        ✏️
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteClick(expense)}
                                        className="actionButton deleteButton"
                                        title="Delete expense"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="exportSection">
                        <p className="exportNote">
                            Need a copy of your expenses? Export them as PDF!
                        </p>
                        <button onClick={handlePrint} className="exportButton">
                            Export as PDF
                        </button>
                    </div>
                </>
            )}
            
            
            {state.showDeleteConfirm && (
                <div className="modal">
                    <div className="modalContent">
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete this expense?</p>
                        <div className="modalActions">
                            <button onClick={handleDeleteConfirm} className="deleteButton">
                                Delete
                            </button>
                            <button onClick={handleDeleteCancel} className="cancelButton">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

           
            {state.editingExpense && (
                <div className="modal">
                    <div className="modalContent">
                        <h3>Edit Expense</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdateExpense({
                                ...state.editingExpense,
                                description: e.target.description.value,
                                amount: Number(e.target.amount.value),
                                category: e.target.category.value
                            });
                        }}>
                            <input
                                name="description"
                                defaultValue={state.editingExpense.description}
                                placeholder="Description"
                                required
                            />
                            <input
                                name="amount"
                                type="number"
                                defaultValue={state.editingExpense.amount}
                                placeholder="Amount"
                                required
                            />
                            <select
                                name="category"
                                defaultValue={state.editingExpense.category}
                                required
                            >
                                <option value="food">Food</option>
                                <option value="transport">Transport</option>
                                <option value="utilities">Utilities</option>
                                <option value="entertainment">Entertainment</option>
                                <option value="shopping">Shopping</option>
                                <option value="health">Health & Medical</option>
                                <option value="sports">Sports & Fitness</option>
                                <option value="bills">Bills & Rent</option>
                                <option value="education">Education</option>
                                <option value="travel">Travel</option>
                                <option value="gifts">Gifts & Donations</option>
                                <option value="electronics">Electronics</option>
                                <option value="clothing">Clothing</option>
                                <option value="pets">Pets</option>
                                <option value="other">Other</option>
                            </select>
                            <div className="modalActions">
                                <button type="submit" className="saveButton">
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setState(prev => ({ ...prev, editingExpense: null }))}
                                    className="cancelButton"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <footer className="footer">
                Made with <span>❤️</span> by Agnit
            </footer>
        </div>
    );
};

export default Home;

