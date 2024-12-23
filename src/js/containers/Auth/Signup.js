import React, { useState } from "react"
import { useNavigate } from "@tata1mg/router"
import "./styles.css"

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Please enter your name');
            return false;
        }

        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }

        return true;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(''); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            
            setError('');
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.message || 'Failed to register. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="authContainer">
            <div className="authCard">
                <h1 className="authTitle">Create Account</h1>
                <p className="authSubtitle">Sign up to start tracking your expenses</p>

                {error && <div className="errorMessage">{error}</div>}

                <form onSubmit={handleSubmit} className="authForm">
                    <div className="formGroup">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div className="formGroup">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="formGroup">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="primaryButton"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="authSwitch">
                    Already have an account?{' '}
                    <button 
                        onClick={() => navigate('/login')} 
                        className="linkButton"
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
}

Signup.setMetaData = () => {
    return [
        <title>Sign Up | Expense Tracker</title>
    ];
};

export default Signup; 




// import React, { useState } from "react"
// import { useNavigate } from "@tata1mg/router"
// import "./styles.css"

// const Signup = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         password: ''
//     });
//     const [error, setError] = useState('');
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const validateForm = () => {
//         if (!formData.name.trim()) {
//             setError('Please enter your name');
//             return false;
//         }

        
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(formData.email)) {
//             setError('Please enter a valid email address');
//             return false;
//         }

        
//         if (formData.password.length < 6) {
//             setError('Password must be at least 6 characters long');
//             return false;
//         }

//         return true;
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//         setError(''); 
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         if (!validateForm()) {
//             return;
//         }

//         setIsSubmitting(true);
//         try {
//             const response = await fetch('/api/auth/register', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(formData)
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || 'Registration failed');
//             }

            
//             setError('');
//             navigate('/login');
//         } catch (error) {
//             console.error('Registration error:', error);
//             setError(error.message || 'Failed to register. Please try again.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <div className="authContainer">
//             <div className="authCard">
//                 <h1 className="authTitle">Create Account</h1>
//                 <p className="authSubtitle">Sign up to start tracking your expenses</p>

//                 {error && <div className="errorMessage">{error}</div>}

//                 <form onSubmit={handleSubmit} className="authForm">
//                     <div className="formGroup">
//                         <label htmlFor="name">Name</label>
//                         <input
//                             type="text"
//                             id="name"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             placeholder="Enter your name"
//                             required
//                         />
//                     </div>

//                     <div className="formGroup">
//                         <label htmlFor="email">Email</label>
//                         <input
//                             type="email"
//                             id="email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             placeholder="Enter your email"
//                             required
//                         />
//                     </div>

//                     <div className="formGroup">
//                         <label htmlFor="password">Password</label>
//                         <input
//                             type="password"
//                             id="password"
//                             name="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             placeholder="Enter your password"
//                             required
//                         />
//                     </div>

//                     <button 
//                         type="submit" 
//                         className="primaryButton"
//                         disabled={isSubmitting}
//                     >
//                         {isSubmitting ? 'Creating Account...' : 'Sign Up'}
//                     </button>
//                 </form>

//                 <p className="authSwitch">
//                     Already have an account?{' '}
//                     <button 
//                         onClick={() => navigate('/login')} 
//                         className="linkButton"
//                     >
//                         Login
//                     </button>
//                 </p>
//             </div>
//         </div>
//     );
// }

// export default Signup; 
