import User from "@entities/Users";
import UserService from "@services/user.service";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { Request, Response } from "express";
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";
class HomeController {
    static async index(req: Request, res: Response) {
        try {
            const users: User[] = await UserService.getAllUsers();
            res.cookie("name", users, { maxAge: 3000 });
            res.render('index.ejs', { users: users });
        } catch (e) {
            console.error(e);
            res.status(500).send('Server Error');  // server error
        }
    }
    static async list(req: Request, res: Response) {
        try {
            const users: User[] = await UserService.getAllUsers();
            res.cookie("name", users, { maxAge: 3000 });
            res.render('home/home.ejs', { users: users });
        } catch (e) {
            console.error(e);
            res.status(500).send('Server Error');  // server error
        }
    }
    static showFormRegister(req: Request, res: Response) {
        // console.log('showFormRegister');
        res.render('auth/register.ejs');
    }
    static showFormLogin(req: Request, res: Response) {
        // get cookies
        const { email, errorLogin } = req.cookies
        res.render('auth/login.ejs', { email: email, errorLogin: errorLogin });
    }
    static async register(req: Request, res: Response) {
        await UserService.createUser(req.body);
        //create cookies
        res.cookie('email', req.body.email, { maxAge: 900000, httpOnly: true });
        res.redirect('/login');
    }
    static async login(req: any, res: Response) {
        try {
            const user: any = await UserService.getAccountbyEmailandPassword(req.body)
            console.log(user);
            if (user) {
                //luu lai session login
                req.session.regenerate(function (err: any) {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ message: "Internal Server Error" });
                        return;
                    }
                    // store user information in session, typically a user id
                    req.session.userIdLogin = user.idUser;
                    req.session.userLogin = user;
                    // save the session before redirection to ensure page
                    // load does not happen before session is saved
                    req.session.save(function (err: any) {
                        if (err) {
                            res.status(500).json({ message: "Session save error" });
                            return;
                        }
                    })
                })
                // 2. Tạo và trả về JWT
                const token = jwt.sign(
                    {
                        userId: user.idUser,
                        email: user.email,
                        role: user.role,
                    },
                    SECRET_KEY,
                    { expiresIn: "1h" }
                );

                // 3. Trả về JSON nếu là request từ API
                if (req.headers["content-type"] === "application/json") {
                    return res.json({ message: "Login successful", token });
                }

                // 4. Nếu là request từ trang web thì redirect
                res.redirect("/home");
            } else {
                // 5. Đăng nhập thất bại, lưu cookie lỗi
                res.cookie("errorLogin", "Invalid Email or Password", {
                    maxAge: 1000,
                    httpOnly: true,
                });
                res.redirect("/login");
            }

        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static logout(req: any, res: Response) {
        req.session.userIdLogin = null;
        req.session.save(function (err: any) {
            if (err) return;

            // regenerate the session, which is good practice to help
            // guard against forms of session fixation
            req.session.regenerate(function (err: any) {
                if (err) return;
                res.redirect('/login')
            })
        })
    }
}

export default HomeController;