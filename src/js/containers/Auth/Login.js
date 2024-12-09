import React, { useState } from "react"
import { useNavigate } from "@tata1mg/router"
import "./styles.css"

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
       
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
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

           
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            
            
            setError('');
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'Failed to login. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="authContainer">
            <div className="authCard">
                <h1 className="authTitle">Welcome Back</h1>
                <p className="authSubtitle">Login to manage your expenses</p>

                {error && <div className="errorMessage">{error}</div>}

                <form onSubmit={handleSubmit} className="authForm">
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
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="authSwitch">
                    Don't have an account?{' '}
                    <button 
                        onClick={() => navigate('/signup')} 
                        className="linkButton"
                    >
                        Sign up
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Login; 
