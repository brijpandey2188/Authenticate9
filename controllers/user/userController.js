const { createJWT } = require("../../middleware/auth");
const User = require("../../models/User");
const Contact = require("../../models/Contact");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const faker = require('faker');

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

// dummy user registration section
exports.dummyUserRegistration = async (req,res) => {
    const numberOfUsers = 20;
    for (let i = 0; i < numberOfUsers; i++) {
        createUniqueUser();
    }
    return res.status(200).json({
        message: 'Data populated successfully.',
        data: "success"
    });
}

// dummy user contacts section
exports.dummyUserContacts = async (req,res) => {
    const numberOfUsers = 4;
    for (let i = 0; i < numberOfUsers; i++) {
        createContact();
    }
    return res.status(200).json({
        message: 'UserContact Data populated successfully.',
        data: "success"
    });
}

const createUniqueUser = async () => {
    try {
        const phoneNumber = await generateUniquePhoneNumber();
        const name = await generateUniqueName();
        const user = await User.create({
            phoneNumber,
            password: "$2b$10$Jp9eZQmqjx3IGKxePLA4cuyirfNWEogSeahpEYhTYY40qFQqVm8ym",
            name,
        });
        console.log(`User created successfully: ${phoneNumber}, ${name}`);
    } catch (error) {
        console.error('Error creating user:', error);
        return;
    }
};

const createContact = async () => {
    try {
        const phoneNumber = await generateUniquePhoneNumber();
        const name = await generateUniqueName();
        const contact = await Contact.create({
            user_id: "3954291f-0749-43d6-a995-696c3853ad97",
            phoneNumber,
            name,
            spam: false
        });
    } catch (error) {
        console.error('Error creating user:', error);
    }
};

const generateUniquePhoneNumber = async () => {
    let phoneNumber = faker.phone.phoneNumber("##########");
    const existingUser = await User.findOne({ where: { phoneNumber } });
    if (existingUser) {
        phoneNumber = await generateUniquePhoneNumber();
    }
    return phoneNumber;
};

const generateUniqueName = async () => {
    let name = faker.name.findName();
    const existingUser = await User.findOne({ where: { name } });
    if (existingUser) {
        name = await generateUniqueName();
    }
    return name;
};


// mark a number as spam section
exports.markNumberSpam = async (req, res) => {
    const {id} = req.params;
    try {
        const contact = await Contact.findByPk(id);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        contact.spam = true;
        const updateContact = await contact.save();
        return res.status(200).json({ data: updateContact, message: 'Conatct number marked as spam successfully' });
    } catch (error) {
        console.error('Error updating contact number:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// search by person name
exports.searchPersonByName = async(req, res) =>  {
    try {
        const usersStartWithName = await User.findAll({
            where: {
                name: {
                    [Op.startsWith]: req.body.name
                }
            }
        });
        const contactsStartWithName = await Contact.findAll({
            where: {
                name: {
                    [Op.startsWith]: req.body.name
                }
            },
        });
        const usersContainName = await User.findAll({
            where: {
                name: {
                    [Op.and]: [
                        { [Op.notLike]: `${req.body.name}%` },
                        { [Op.like]: `%${req.body.name}%` }
                    ]
                }
            }
        });
        const contactsContainName = await Contact.findAll({
            where: {
                name: {
                    [Op.and]: [
                        { [Op.notLike]: `${req.body.name}%` },
                        { [Op.like]: `%${req.body.name}%` }
                    ]
                }
            }
        });
        let finalResult = [
            ...usersStartWithName,
            ...contactsStartWithName,
            ...usersContainName,
            ...contactsContainName
        ];
        return res.status(200).json({ data: finalResult, message: 'Names fetched successfully' });
    } catch (error) {
        console.error('Error in searching:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// search by conatct number
exports.searchByContactNumber = async (req, res) => {
    try {
        const phoneNumber = req.body.phoneNumber;
        const user = await User.findOne({
            where: {
                phoneNumber: phoneNumber
            }
        });
        if (user) {
            return res.status(200).json({ data: [user], message: 'Record fetched successfully' });
        } else {
            const contacts = await Contact.findAll({
                where: {
                    phoneNumber: phoneNumber
                }
            });
            return res.status(200).json({ data: contacts, message: 'Records fetched successfully' });
        }
    } catch (error) {
        console.error('Error searching by phone number:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


// get detail using user or contact id
exports.getContactDetail = async (req, res) => {
    try {
        const personId = req.params.contactId;
        const userDetail = await User.findByPk(personId);
        let displayDetails = {};
        // if details not found in User table that means conatct number not registered
        if (!userDetail) {
            const conatctDetail = await Contact.findByPk(personId);
            if(!conatctDetail){
                return res.status(404).json({ message: 'Contact detail not found' });
            } else {
                displayDetails = {
                    id: conatctDetail.id,
                    name: conatctDetail.name,
                    phoneNumber: conatctDetail.phoneNumber,
                    spam: conatctDetail.spam
                };
                return res.status(200).json({
                    message: 'Contact Detail',
                    data: displayDetails
                });
            }
        }
        // if a person is registered then display email
        displayDetails = {
            id: userDetail.id,
            name: userDetail.name,
            phoneNumber: userDetail.phoneNumber,
            email: userDetail.phoneNumber,
        };

        // check that the registered user is also in the contact list and check spam value:
        const userInContact = await Contact.findOne({ where: { phoneNumber: userDetail.phoneNumber } });
        if(userInContact){
            displayDetails.spam = userInContact.spam;
        } else {
            displayDetails.spam = false;
        }
        return res.status(200).json({
            message: 'User Detail',
            data: displayDetails
        });
    } catch (error) {
        console.error('Error displaying person details:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};