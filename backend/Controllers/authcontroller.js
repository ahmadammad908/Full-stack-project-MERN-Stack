import {User} from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import { sendVerificationEmail,sendWelcomeEmail } from "../mail/emails.js"
import {generateTokenAndSetCookie} from '../utils/generateTokenAndSetCookie.js'
import {generateVerificationCode} from '../utils/generateVerificationCode.js'
export const signup = async (req, res) => {
    const {email,password,name}= req.body
    try {
        if(!email || !password || !name) {
            throw new Error("All fields are required");
        }
        const userAlreadyExists = await User.findOne({email});
        if(userAlreadyExists) {
            return res.status(400).json({success:false,message: "User already exists"})
        }

        const hashPassword = await bcryptjs.hash(password,10);
        const verificationToken = generateVerificationCode()
        const user = new User({
            email,
            password: hashPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() +24 * 60  *60 * 1000 
        })
        await user.save()

        generateTokenAndSetCookie(res,user._id);

       await sendVerificationEmail(user.email,verificationToken)
        res.status(201).json({
            success:true,
            message:"User created Successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        res.status(400).json({success:false,message: error.message})

    }
}


export const verifyEmail =async(req,res)=> {
const {code } = req.body
try {
    const user = await User.findOne({
        verificationToken: code,
        verificationTokenExpiresAt:{$gt:Date.now()},
    });
    if(!user) {
        return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    await sendWelcomeEmail(user.email, user.name);
    res.status(200).json({
        success: true,
        message: "Email verified successfully",
        user: {
            ...user._doc,
            password: undefined,
        },
    });
} catch (error) {
    console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
     
}
}

export const login = async (req,res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({success:false,message:"Invalid crendiential"});
        }
        const isPasswordValid = await bcryptjs.compare(password,user.password)
        if(!isPasswordValid) {
            return res.status(400).json({success:false,message:"Invalid crendiential"});
        }
        generateTokenAndSetCookie(res, user._id);
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
    } catch (error) {
        console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
    }
}


export const logout = async (req,res) => {
    res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
}