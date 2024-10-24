// src/routes/userRoute.ts
import express from "express";
import { UserController } from "../controllers/userController";
import { UserInteractor } from "../../application/interactor/userInteractor";
import { UserRepo } from "../../infrastructure/repositories/userRepo";
import { HashPassword } from "../../application/services/bcryptService";
import { validateUserInput } from "../middleware/userValidation";
import { verifyToken } from "../middleware/userAuthMiddleware";
import { JWT } from "../../application/services/jwtService";
import EmailService from "../../application/services/emailService";

const userRoute = express.Router()
// Create instances of services and repositories
const hashedPassword = new HashPassword();
const userRepo = new UserRepo();
const jwt = new JWT()
const email=new EmailService()
const userInteractor = new UserInteractor(userRepo, hashedPassword,jwt,email); 
const userController = new UserController(userInteractor);


// Routes
userRoute.post('/',userController.userLogin.bind(userController));
userRoute.post('/register', validateUserInput, userController.userRegister.bind(userController));
userRoute.post('/otpVerify', userController.otpVerify.bind(userController));
userRoute.get('/profile',verifyToken,userController.userProfile.bind(userController))
userRoute.patch('/edit',verifyToken, userController.editProfile.bind(userController));
userRoute.patch('/change-password',verifyToken, userController.changePassword.bind(userController));


export default userRoute;