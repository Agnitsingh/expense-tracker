const User = require('./user.model');
const bcrypt = require('bcrypt');

// Number of salt rounds for bcrypt
const SALT_ROUNDS = 10;

// Email validation function
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Password validation function
const isValidPassword = (password) => {
    return password && password.length >= 6;
};

exports.register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Validate email
        if (!isValidEmail(email)) {
            return res.status(400).json({ 
                message: 'Please enter a valid email address'
            });
        }

        // Validate password
        if (!isValidPassword(password)) {
            return res.status(400).json({ 
                message: 'Password must be at least 6 characters long'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                message: 'User with this email already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Create new user with hashed password
        const user = new User({
            email,
            password: hashedPassword,
            name
        });

        await user.save();

        res.status(201).json({
            message: 'Registration successful!',
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ 
                message: 'Please enter a valid email address'
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                message: 'No account found with this email. Please sign up first.'
            });
        }

        // Compare password with hashed password in database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                message: 'Incorrect password. Please try again.'
            });
        }

        res.json({
            message: 'Login successful!',
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Something went wrong. Please try again later.'
        });
    }
}; 