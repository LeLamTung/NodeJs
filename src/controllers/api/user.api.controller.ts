import User from "@entities/Users";
import UserService from "@services/user.service";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";
class UserApiController {
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
    
    static async storeUser(req: Request, res: Response) {
        try {
            const User = await UserService.createUser(req.body);
            return res.status(201).json({
                cod: 201,
                message: "Thêm mới thành công",
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
    
    static async updateUser(req: Request, res: Response) {
        try {
            console.log("Dữ liệu nhận được:", req.body);
            const user = await UserService.updateUser(req.body);
    
            res.json({
                cod: 200,
                message: "Cập nhật thành công",
                data: user,
            });
        } catch (error) {
            console.error("Lỗi:", error);
            res.status(500).json({
                cod: 500,
                message: "Lỗi server",
            });
        }
    }
    
    static async deleteUser(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id, 10);    
            const User = await UserService.deleteUser(id);
    
            // Nếu không tìm thấy User để xóa
            if (!User) {
                return res.status(404).json({
                    "cod": 404,
                    "message": "Không tìm thấy user cần xóa",
                });
            }
    
            // Nếu xóa thành công
            const data = {
                "cod": 200,
                "message": "Xóa thành công",
                "data": User,
            }
            return res.status(200).json(data);
        }
        catch (error) {
            console.error("Lỗi khi xóa User:", error);
            return res.status(500).json({
                "cod": 500,
                "message": "Server error",
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
                return res.redirect("/login");
            }else if(user.email != req.body.email){
                res.cookie("errorLogin", "Email không hợp lệ", {
                    maxAge: 1000,
                    httpOnly: true,
                });
                return res.redirect("/login");
            }
    
            // ✅ Kiểm tra trước khi lưu vào session
            console.log("User before saving to session:", user);
    
            req.session.regenerate((err: any) => {
                if (err) {
                    console.error("Session regeneration error:", err);
                    return res.status(500).json({ message: "Internal Server Error" });
                }
    
                req.session.userIdLogin = user.idUser;
                req.session.userLogin = user;
    
                req.session.save((err: any) => {
                    if (err) {
                        console.error("Session save error:", err);
                        return res.status(500).json({ message: "Session save error" });
                    }
    
                    console.log("Session after setting user:", req.session); // ✅ Debug session
    
                    // ✅ Tạo JWT
                    const token = jwt.sign(
                        {
                            userId: user.idUser,
                            email: user.email,
                            role: user.role,
                        },
                        SECRET_KEY,
                        { expiresIn: "1h" }
                    );
                    // res.redirect("/home");
                    console.log(token)
                    return res.json({ message: "Login successful", token });
                    
                });
            });
    
        } catch (err) {
            console.error("Login error:", err);
            return res.status(500).json({ message: "Error logging in user" });
        }
    }
    
}
export default UserApiController;
