const { createJWT } = require("../../middleware/auth");
const User = require("../../models/User");
const bcrypt = require("bcrypt");

// user login section
exports.userLogin = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({ error: 'Phone number is required!' });
        }
        if (!password) {
            return res.status(400).json({ error: 'Password is required!' });
        }

        const user = await User.findOne({
            where: {
                phoneNumber: phoneNumber
            }
        });
        if (!user) {
            return res.status(400).json({ error: 'Incorrect Credentials!' });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ error: 'Incorrect Credentials!' });
        }
        const jwtToken = createJWT(user.id, user.role);
        return res.status(200).json({
            message: 'Logged In successfully.',
            data: {
                token: jwtToken
            }
        });
    } catch (e) {
        console.log(e)
        return res.status(500).json({ error: 'Server Problem!' });
    }
}

// user registration section
exports.userRegistration = async (req, res) => {
    const { phoneNumber, password, name, email } = req.body;
    if (!phoneNumber) {
        return res.status(400).json({ error: 'Phone number is required!' });
    } else if (!name) {
        return res.status(400).json({ error: 'Name is required!' });
    }
    try {
        // check for phone number already exists
        const existingUser = await User.findOne({ where: { phoneNumber } });
        if (existingUser) {
            return res.status(400).json({ error: 'Phone number already exists!' });
        }
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // register user
        const user = await User.create({
            phoneNumber,
            password: hashedPassword,
            name,
            email
        });
        res.status(201).json({ data:user, message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

