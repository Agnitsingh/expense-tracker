import React from "react"
import { useNavigate } from "@tata1mg/router"
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import "./styles.css"

// Register ChartJS components
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
);

const Analytics = () => {
    const navigate = useNavigate();
    const [expenses, setExpenses] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchExpenses = async () => {
            try {
                // Only proceed if we're on the client side
                if (typeof window === 'undefined') return;

                const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
                if (!currentUser || !currentUser.id) {
                    navigate('/login');
                    return;
                }

                const response = await fetch('/api/expenses', {
                    headers: {
                        'user-id': currentUser.id
                    }
                });

                if (!response.ok) throw new Error('Failed to fetch expenses');

                const data = await response.json();
                setExpenses(data.expenses || []);
            } catch (error) {
                console.error('Error fetching expenses:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, [navigate]);

    // Calculate category data
    const categoryData = React.useMemo(() => {
        const totals = expenses.reduce((acc, expense) => {
            const category = expense.category.charAt(0).toUpperCase() + expense.category.slice(1);
            acc[category] = (acc[category] || 0) + Number(expense.amount);
            return acc;
        }, {});

        return Object.entries(totals).map(([category, total]) => ({
            category,
            total
        })).sort((a, b) => b.total - a.total);
    }, [expenses]);

    // Calculate monthly data
    const monthlyData = React.useMemo(() => {
        const totals = expenses.reduce((acc, expense) => {
            const date = new Date(expense.timestamp);
            const monthYear = date.toLocaleString('en-US', { month: 'short', year: '2-digit' });
            acc[monthYear] = (acc[monthYear] || 0) + Number(expense.amount);
            return acc;
        }, {});

        return Object.entries(totals)
            .map(([month, total]) => ({
                month,
                total
            }))
            .sort((a, b) => {
                const [monthA, yearA] = a.month.split(' ');
                const [monthB, yearB] = b.month.split(' ');
                const dateA = new Date(`${monthA} 20${yearA}`);
                const dateB = new Date(`${monthB} 20${yearB}`);
                return dateA - dateB;
            });
    }, [expenses]);

    const pieChartData = {
        labels: categoryData.map(item => item.category),
        datasets: [{
            data: categoryData.map(item => item.total),
            backgroundColor: [
                '#4F46E5', // Indigo
                '#10B981', // Emerald
                '#F59E0B', // Amber
                '#EF4444', // Red
                '#8B5CF6', // Purple
                '#6366F1'  // Blue
            ],
            borderWidth: 1
        }]
    };

    const barChartData = {
        labels: monthlyData.map(item => item.month),
        datasets: [{
            label: 'Monthly Expenses',
            data: monthlyData.map(item => item.total),
            backgroundColor: '#4F46E5',
            borderColor: '#4338CA',
            borderWidth: 1
        }]
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Monthly Expense Trends'
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => {
                        return new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            maximumFractionDigits: 0
                        }).format(value);
                    }
                }
            }
        }
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
            },
            title: {
                display: true,
                text: 'Expense Distribution by Category'
            }
        }
    };

    // Show loading state
    if (loading) {
        return (
            <div className="container">
                <header className="header">
                    <div className="headerContent">
                        <div className="headerTitles">
                            <h1 className="title">Expense Analytics</h1>
                            <p className="subtitle">Loading your spending insights...</p>
                        </div>
                    </div>
                </header>
                <div className="loading">
                    <p>Loading your expense data...</p>
                </div>
            </div>
        );
    }

    // Show no data state
    if (!expenses.length) {
        return (
            <div className="container">
                <header className="header">
                    <div className="headerContent">
                        <div className="headerTitles">
                            <h1 className="title">Expense Analytics</h1>
                            <p className="subtitle">Your spending patterns at a glance</p>
                        </div>
                        <button 
                            onClick={() => navigate('/')}
                            className="backButton"
                        >
                            ← Back to Dashboard
                        </button>
                    </div>
                </header>

                <div className="noData">
                    <p>No expense data available. Add some expenses to see analytics!</p>
                    <button 
                        onClick={() => navigate('/add')}
                        className="addButton"
                    >
                        + Add Expense
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <header className="header">
                <div className="headerContent">
                    <div>
                        <h1 className="title">Expense Analytics</h1>
                        <p className="subtitle">Visualize your spending patterns</p>
                    </div>
                    <button 
                        onClick={() => navigate('/')}
                        className="backButton"
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </header>

            <div className="statsGrid">
                <div className="card">
                    <h3 className="cardTitle">Category-wise Expenses</h3>
                    <div className="chartContainer">
                        <Pie 
                            data={pieChartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false
                            }}
                        />
                    </div>
                    <div className="chartLegend">
                        {categoryData.map((item, index) => (
                            <div key={item.category} className="legendItem">
                                <span 
                                    className="legendColor"
                                    style={{ 
                                        backgroundColor: pieChartData.datasets[0].backgroundColor[index] 
                                    }}
                                />
                                <span className="legendLabel">{item.category}</span>
                                <span className="legendValue">
                                    {new Intl.NumberFormat('en-IN', {
                                        style: 'currency',
                                        currency: 'INR',
                                        maximumFractionDigits: 0
                                    }).format(item.total)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h3 className="cardTitle">Monthly Trends</h3>
                    <div className="chartContainer">
                        <Bar 
                            data={barChartData}
                            options={barChartOptions}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics; 