import React from "react"
import { RouterDataProvider } from '@tata1mg/router'
import Home from "@containers/Home/Home"
import AddExpense from "@containers/AddExpense/AddExpense"
import Login from "@containers/Auth/Login"
import Signup from "@containers/Auth/Signup"
import Analytics from "@containers/Analytics/Analytics"
import configureStore from "@store"

const routes = [
    {
        path: "/login",
        component: Login
    },
    {
        path: "/signup",
        component: Signup
    },
    {
        path: "/",
        component: Home
    },
    {
        path: "/add",
        component: AddExpense
    },
    {
        path: "/analytics",
        component: Analytics
    }
];

export const AppRoutes = () => {
    const store = configureStore({});
    
    return (
        <RouterDataProvider
            routes={routes}
            initialState={{}}
            fetcherArgs={{ store }}
        >
            <div id="router-content" />
        </RouterDataProvider>
    );
};

export default routes;





// import React from "react"
// import { RouterDataProvider } from '@tata1mg/router'
// import Home from "@containers/Home/Home"
// import AddExpense from "@containers/AddExpense/AddExpense"
// import Login from "@containers/Auth/Login"
// import Signup from "@containers/Auth/Signup"
// import Analytics from "@containers/Analytics/Analytics"

// const calculateCategoryData = (expenses) => {
//     const categoryTotals = expenses.reduce((acc, expense) => {
//         const category = expense.category.charAt(0).toUpperCase() + expense.category.slice(1);
//         acc[category] = (acc[category] || 0) + Number(expense.amount);
//         return acc;
//     }, {});

//     return Object.entries(categoryTotals).map(([category, total]) => ({
//         category,
//         total
//     })).sort((a, b) => b.total - a.total);
// };

// const calculateMonthlyData = (expenses) => {
//     const monthlyTotals = expenses.reduce((acc, expense) => {
//         const date = new Date(expense.timestamp);
//         const monthYear = date.toLocaleString('en-US', { month: 'short', year: '2-digit' });
//         acc[monthYear] = (acc[monthYear] || 0) + Number(expense.amount);
//         return acc;
//     }, {});

//     return Object.entries(monthlyTotals)
//         .map(([month, total]) => ({
//             month,
//             total
//         }))
//         .sort((a, b) => {
//             const [monthA, yearA] = a.month.split(' ');
//             const [monthB, yearB] = b.month.split(' ');
//             const dateA = new Date(`${monthA} 20${yearA}`);
//             const dateB = new Date(`${monthB} 20${yearB}`);
//             return dateA - dateB;
//         });
// };


// const ProtectedRoute = ({ component: Component, routeProps }) => {
//     if (typeof window !== 'undefined') {
//         const currentUser = localStorage.getItem('currentUser');
//         if (!currentUser) {
//             window.location.href = '/login';
//             return null;
//         }
//     }
//     return <Component {...routeProps} />;
// };

// const routes = [
//     {
//         path: "/login",
//         component: Login,
//         clientFetcher: async () => {
//             return { isLoggedIn: false };
//         }
//     },
//     {
//         path: "/signup",
//         component: Signup,
//         clientFetcher: async () => {
//             return { isRegistered: false };
//         }
//     },
//     {
//         path: "/",
//         end: true,
//         component: (props) => <ProtectedRoute component={Home} routeProps={props} />,
//         clientFetcher: async () => {
//             try {
//                 const currentUser = JSON.parse(localStorage.getItem('currentUser'));
//                 console.log('Current user from localStorage:', currentUser);

//                 if (!currentUser || !currentUser.id) {
//                     console.log('No user ID found, returning empty data');
//                     return { expenses: [], totalAmount: 0 };
//                 }

//                 console.log('Fetching expenses for user ID:', currentUser.id);

//                 const response = await fetch('/api/expenses', {
//                     headers: {
//                         'user-id': currentUser.id
//                     }
//                 });

//                 if (!response.ok) {
//                     throw new Error('Failed to fetch expenses');
//                 }

//                 const data = await response.json();
//                 console.log('Received expense data:', data);

//                 return {
//                     expenses: data.expenses || [],
//                     totalAmount: data.totalAmount || 0
//                 };
//             } catch (error) {
//                 console.error('Client fetcher error:', error);
//                 return { expenses: [], totalAmount: 0 };
//             }
//         }
//     },
//     {
//         path: "/add",
//         component: (props) => <ProtectedRoute component={AddExpense} routeProps={props} />,
//         clientFetcher: async () => {
//             return { categories: ['food', 'transport', 'entertainment', 'shopping', 'others'] };
//         }
//     },
//     {
//         path: "/analytics",
//         component: (props) => <ProtectedRoute component={Analytics} routeProps={props} />,
//         clientFetcher: async () => {
//             try {
//                 const currentUser = JSON.parse(localStorage.getItem('currentUser'));
//                 if (!currentUser || !currentUser.id) {
//                     return { categoryData: [], monthlyData: [] };
//                 }

//                 const response = await fetch('/api/expenses', {
//                     headers: {
//                         'user-id': currentUser.id
//                     }
//                 });

//                 if (!response.ok) {
//                     throw new Error('Failed to fetch expenses');
//                 }

//                 const { expenses } = await response.json();
//                 return {
//                     categoryData: calculateCategoryData(expenses),
//                     monthlyData: calculateMonthlyData(expenses)
//                 };
//             } catch (error) {
//                 console.error('Client fetcher error:', error);
//                 return { categoryData: [], monthlyData: [] };
//             }
//         }
//     }
// ];


// export const AppRoutes = () => (
//     <RouterDataProvider
//         routes={routes}
//         initialState={{}}
//         fetcherArgs={{}}
//         config={{}}
//     >
        
//     </RouterDataProvider>
// );

// export default routes;
