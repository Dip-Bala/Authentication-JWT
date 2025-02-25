import jwt from 'jsonwebtoken';
import UserModel from '../Models/UserModels.js'
const maxAge = 3*24*60*60;

const createToken = (id) => {
    return jwt.sign({id}, "Bala Dipanwita super secrect key", {
        expiresIn : maxAge
    })
}
const handleErrors = (error) => {
    let errors = {email : "", passwords : ""};
    if(error.message === "Incorrect Email"){
        errors.email = "The email is not registered";
    }
    if(error.message === "Incorrect Password"){
        errors.password = "The password is incorrect";
    }
    if(error.code === 11000){
        errors.email = "Email is already registered";
        return errors;
    }

    if(error.message.includes('Users validation failed')){
        Object.values(error.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;

}
export const register = async (req, res, next) => {
    try {
        console.log("Request Body:", req.body); // Debugging line

        const {email, password} = req.body;
        const user = await UserModel.create(email, password);
        const token = createToken(user._id);

        res.cookie("jwt", token, {
            withCredentials: true,
            httpOnly: false,
            maxAge: maxAge*1000
        })

        res.status(201).json({user: user._id, created: true})
    } catch (error) {
        console.log(error);
        const errors = handleErrors(error);
        res.json({errors, created: false});
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.login(email, password); // Call the defined login method
        const token = createToken(user._id);

        res.cookie("jwt", token, {
            withCredentials: true,
            httpOnly: true, // More secure
            maxAge: maxAge * 1000,
        });

        res.status(200).json({ user: user._id, created: true });
    } catch (error) {
        console.log(error);
        const errors = handleErrors(error);
        res.status(400).json({ errors, created: false });
    }
};

export const secret = async (req, res, next) => {};

