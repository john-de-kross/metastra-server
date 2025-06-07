const User = require('../MODELS/userModel');

exports.createUser = async (req, res, next) => {
    try {
        const { firstname, surname, gender, email, phone, dob, password } = req.body;
        const userEmail = await User.findOne({ email }).exec();
        const userPhone = await User.findOne({ phone }).exec();
        
        if (!firstname) return res.status(400).json({ success: 'fail', message: 'Firstname is required' });
        if (!surname) return res.status(400).json({ success: 'fail', message: 'Surname is required' });
        if (!email && !phone) return res.status(400).json({ success: 'fail', message: 'Either email or phone number is required' });
        if (!password) return res.status(400).json({ success: 'fail', message: 'Password is required' });
        if (!dob) return res.status(400).json({ success: 'fail', message: 'Provide your date of birth' });
        if (!gender) return res.status(400).json({ success: 'fail', message: 'Provide your gender'});

        if (firstname.length < 3) return res.status(400).json({ success: 'fail', message: 'Firstname must be at least 3 characters' });
        if (surname.length < 3) return res.status(400).json({ success: 'fail', message: 'surname must be at least 3 characters' });
        if (password.length < 8) return res.status(400).json({ success: 'fail', message: 'Password must have at least 8 characters' });


        const validateAge = dob => {
            const birthDate = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            const d = today.getDate() - birthDate.getDate();

            if (m < 0 || (m === 0 && d < 0)) age--;

            return age >= 8;
        };

        if (!validateAge(dob)) return res.status(400).json({ success: 'fail', message: 'It looks like you entered the wrong info. You must be atleast 8 years old' });
        
        if (userEmail) return res.status(400).json({ success: 'fail', message: 'Email already exists' });

        if (userPhone) return res.status(400).json({ success: 'fail', message: 'Phone number alreay exists' });


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
        return res.status(500).json({
            success: false,
            message: 'Failed to register user',
            error: error.message
        })
    }

}