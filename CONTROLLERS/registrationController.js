const User = require('../MODELS/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../CONTROLLERS/ERROR/appError');


exports.createUser = async (req, res, next) => {
    try {
        const { firstname, surname, gender, email, phone, dob, password } = req.body;
        const userEmail = await User.findOne({ email }).exec();
        const userPhone = await User.findOne({ phone }).exec();  
        
        if (!firstname) return next(new AppError('Firstname is required', 400));
        if (!surname) return next(new AppError('Surname is required', 400));
        if (!email && !phone) return next(new AppError('Either email or phone is required', 400));
        if (!password) return next(new AppError('Password is required', 400));
        if (!dob) return next(new AppError('Provide your date of birth', 400));
        if (!gender) return next(new AppError('Provide your gender', 400));

        if (firstname.length < 3) return next(new AppError('Firstname must be at least 3 characters', 400));
        if (surname.length < 3) return next(new AppError('Surname must be at least 3 characters', 400));
        if (password.length < 8) return next(new AppError('Password must be at least 8 characters', 400));


        const validateAge = dob => { 
            const birthDate = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            const d = today.getDate() - birthDate.getDate();

            if (m < 0 || (m === 0 && d < 0)) age--;

            return age >= 8;
        };

        if (!validateAge(dob)) return next(new AppError('It looks like you entered the wrong info. You must be atleast 8 years old', 400));
        
        if (userEmail) return next(new AppError('Email already exists', 400));

        if (userPhone) return next(new AppError('Phone number already exists', 400));


        const user = await User.create({
            firstname,
            surname,
            gender,
            email,
            phone,
            dob,
            password
        })

        if (user) {
            const { password, ...userWithoutPassword } = user.toObject();
            res.status(201).json({
                success: true, 
                message: 'User created successfully',
                data: userWithoutPassword
            })
        }


        
    } catch (error) {
        next(error)
    }

}