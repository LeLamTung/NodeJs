import User from "@entities/Users";
import UserService from "@services/user.service";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";
declare module "express-session" {
    interface SessionData {
        userIdLogin: string;
        userLogin:string
        }
}
class AuthApiController {
    static async getAllUsers(req: Request, res: Response) {
        try {
            const Users: User[] = await UserService.getAllUsers();
            const data = {
                "cod": 200,
                "data": Users,
            }
            res.json(data);
        }
        catch (error) {
            const data = {
                "cod": 500,
                "message": "Server error",
            }
            res.json(data);
        }
    }
    static async getUserById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id, 10);

            if (isNaN(id)) {
                return res.status(400).json({ message: "ID không hợp lệ" });
            }

            const user = await UserService.getUserById(id); // Thêm await

            if (!user) {
                return res.status(404).json({ message: "User không tồn tại" });
            }

            res.json({
                cod: 200,
                message: "Lấy dữ liệu thành công",
                data: {
                    idUser: user.idUser,
                    UserName: user.UserName,
                    email: user.Email,
                    isActive: user.IsActive,
                }
            });
        } catch (error) {
            console.error("Lỗi khi lấy thông tin user:", error);
            res.status(500).json({ message: "Lỗi server" });
        }
    }

    static async register(req: Request, res: Response) {
        try {
            const User = await UserService.createUser(req.body);
            //create cookies
            res.cookie('email', req.body.Email, { maxAge: 900000, httpOnly: true });
            return res.status(201).json({
                cod: 201,
                message: "Tạo tài khoản thành công",
                data: User,
            });
        } catch (error: unknown) {
            console.error("Lỗi khi tạo tài khoản:", error);

            // Kiểm tra nếu error là một object và có property "code"
            if (typeof error === "object" && error !== null && "code" in error) {
                const errorObj = error as { code: string };

                if (errorObj.code === "ER_DUP_ENTRY" || errorObj.code === "23505") {
                    return res.status(400).json({
                        cod: 400,
                        message: "Email đã tồn tại, vui lòng nhập email khác.",
                    });
                }
            }

            return res.status(500).json({
                cod: 500,
                message: "Lỗi server, vui lòng thử lại sau.",
            });
        }
    }
    static async login(req: Request, res: Response) {
        try {
            const user: any = await UserService.getAccountbyEmailandPassword(req.body);
            if (!user) {
                res.cookie("errorLogin", "Invalid Email or Password", {
                    maxAge: 1000,
                    httpOnly: true,
                });
                return res.redirect("http://localhost:3000/auth/signin");
            }
    
            console.log("User before saving to session:", user);
    
            req.session.regenerate((err: any) => {
                if (err) {
                    console.error("Session regeneration error:", err);
                    return res.status(500).json({ message: "Internal Server Error" });
                }
    
                req.session.userIdLogin = user.idUser;
                console.log("User ID after setting to session:", req.session.userIdLogin);
                req.session.userLogin = user;
                console.log("User after setting to session:", req.session.userLogin);
    
                req.session.save((err: any) => {
                    if (err) {
                        console.error("Session save error:", err);
                        return res.status(500).json({ message: "Session save error" });
                    }
    
                    console.log("Session after setting user:", req.session);
    
                    // ✅ Tạo JWT token
                    const token = jwt.sign(
                        {
                            userId: user.idUser,
                            email: user.Email,
                            role: user.role,
                        },
                        SECRET_KEY,
                        { expiresIn: "1h" }
                    );
                    console.log(token);
    
                    // Gửi token qua cookie
                    res.cookie('token', token, {
                        httpOnly: true,   // Đảm bảo cookie không thể truy cập từ JavaScript
                        maxAge: 3600000  // Cookie hết hạn sau 1 giờ
                    });
    
                    return res.json({
                        message: "Login successful",
                        user: {
                            idUser: user.idUser,
                            Email: user.Email,
                            Role: user.Role,
                        }
                    });
                });
            });
    
        } catch (err) {
            console.error("Login error:", err);
            return res.status(500).json({ message: "Error logging in user" });
        }
    }
    

    static logout(req: any, res: Response) {
        req.session.userIdLogin = null;
        res.clearCookie('token');  // Xóa token trong cookie
        req.session.save(function (err: any) {
            if (err) return res.status(500).json({ message: 'Error saving session' });
    
            req.session.regenerate(function (err: any) {
                if (err) return res.status(500).json({ message: 'Error regenerating session' });
                // Trả về thông báo logout thành công thay vì redirect
                res.status(200).json({ message: 'Logout successful' });
            });
        });
    }
    

}
export default AuthApiController;
