const User = require('./user.model');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidPassword = (password) => {
    return password && password.length >= 6;
};

exports.register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!isValidEmail(email)) {
            return res.status(400).json({ 
                message: 'Please enter a valid email address'
            });
        }

        if (!isValidPassword(password)) {
            return res.status(400).json({ 
                message: 'Password must be at least 6 characters long'
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                message: 'User with this email already exists'
            });
        }

        
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

       
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

       
        if (!isValidEmail(email)) {
            return res.status(400).json({ 
                message: 'Please enter a valid email address'
            });
        }

        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                message: 'No account found with this email. Please sign up first.'
            });
        }

        
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
