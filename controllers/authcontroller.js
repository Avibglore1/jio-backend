const UserModel = require("../Model/UserModel");
const emailSender = require("../utility/DynamicEmailSender");
const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;
const promisifiedJWTSign = promisify(jwt.sign);
const promisifiedJWTVerify = promisify(jwt.verify);
const {JWT_SECRET} = process.env;

async function forgetPasswordHandler(req,res){
    try{
        if(req.body.email == undefined){
            return res.status(401).json({
                status: 'failure',
                message: 'Please enter the email for forget Password'
            })
        }

        const user = await UserModel.findOne({email: req.body.email});
        if(user == null){
            return res.status(404).json({
                status: 'failure',
                message: 'user not found for this email'
            })
        }
        const otp = otpGenerator();
        user.otp = otp;
        user.otpExpiry = Date.now() + 1000 * 60 * 10 

        await user.save({
            validateBeforeSave: false
        })
        //  send email
        // email -> req.body.email
        // otp -> add 

        res.status(200).json({
            message: 'otp is sent successfully',
            status: 'success',
            otp: otp,
            resetURL: `http:localhost:3000/api/auth/resetPassword/${user["_id"]}`
        })
        const templateData = { name: user.name, otp: user.otp }
        await emailSender("./templates/otp.html", user.email, templateData);
    }catch(err){
        console.log('err', err);
        res.status(500).json({
            message: err.message,
            status: 'failure'
        });
    }
}

async function resetPasswordHandler(req, res){
    try{
        let resetDetails = req.body;
        if(!resetDetails.password || !resetDetails.confirmPassword || !resetDetails.otp
            || resetDetails.password != resetDetails.confirmPassword){
                res.status(401).json({
                    status: 'failure',
                    message: 'invalid request'
                });
            }
        const user = await UserModel.findOne({email: req.body.email});
        if (user == null){
            return res.status(404).json({
                status: 'failure',
                message: 'user not found'
            });
        } 
        if(user.otp == undefined){
            return res.status(401).json({
                status: 'failure',
                message: 'unauthorized access to rest password'
            });
        }
        if(Date.now() > user.otpExpiry){
            return res.status(401).json({
                status: 'failure',
                message: 'otp expired'
            });
        }
        if(user.otp != resetDetails.otp){
            return res.status(401).json({
                status: 'failure',
                message: 'otp is incorrect'
            });
        }
        user.password = resetDetails.password;
        user.confirmPassword = resetDetails.confirmPassword;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();
        res.status(200).json({
            status: 'sucess',
            message: 'password reset successfully'
        })   
    }catch(err){
        console.log('err'. err);
        res.status(500).json({
            message: err.message,
            status: 'failure'
        })
    }
}

async function signupHandler(req, res){
    try{
        const userObject = req.body;
        if(!userObject.email || !userObject.password){
            return res.status(401).json({
                message: 'required data missing',
                status: 'failure'
            });
        }
        const user = await UserModel.findOne({email: userObject.email});
        if(user){
            return res.status(400).json({
                message: 'user already exist',
                status: 'failure'
            })
        }
        const newUser = await UserModel.create(userObject);
        res.status(200).json({
            message: 'user created',
            status: 'success',
            user: newUser
        })
        // user Email -> verification of there Email Id 
        // welcome Email 
    }catch(err){
        console.log('err', err);
        res.status(500).json({
            message: err.message,
            status: 'failure'
        })
    }
}

async function loginHandler(req,res){
    try{
        const {email, password} = req.body;
        const user = await UserModel.findOne({email: email});
        if(!user){
            return res.status(404).json({
                message: 'invalid email or password',
                status: 'failure'
            })
        }
        const areEqual = user.password == password
        if(!areEqual){
            return res.status(404).json({
                message: 'invalid email or password',
                status: 'failure'
            });
        }
        const authToken = await promisifiedJWTSign({id: user['_id']}, process.env.JWT_SECRET);
        res.cookie('jwt', authToken, {
            maxAge: 1000*60*60*24,
            httpOnly: true, //it can be accessed only by server
        })
        res.status(200).json({
            message: 'user login successfully',
            status: 'success',
            user: user
        })

    }catch(err){
        console.log('err', err);
        res.status(500).json({
            message: err.message,
            status: 'failure'
        });
    }
}

const logoutController = function(req,res){
    res.cookie('JWT', '', {
        maxAge: Date.now(),
        httpOnly: true,
        path: '/',
        sameSite: 'None',
        secure: true
    })
    res.status(200).json({
        message: 'user logout successfully',
        status: 'success'
    });
}

const otpGenerator = function(){
    return Math.floor(100000 + Math.random() * 900000)
}

const protectRouteMiddleWare = async function (req, res, next) {
    try{
        let jwttoken = req.cookie.JWT;
        if(!jwttoken) throw new Error('Unauthorized');

        let decryptedToken = await promisifiedJWTVerify(jwttoken, JWT_SECRET);
        if(decryptedToken){
            let userId = decryptedToken.id;
            req.userId = userId;
            console.log('authenticated');
            next();
        }
    }catch(err){
        res.status(500).json({
            message: err.message,
            status: 'failure'
        })
    }
}

module.exports = {
    forgetPasswordHandler,
    resetPasswordHandler,
    signupHandler,
    loginHandler,
    logoutController,
    protectRouteMiddleWare,

}