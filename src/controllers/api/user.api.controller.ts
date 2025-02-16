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
    static async storeUser(req: Request, res:Response) {
        try {
            const User = await UserService.createUser(req.body);
            const data = {
                "cod": 200,
                "message": "Thêm mới thành công",
                "data": User,
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
    static async updateUser(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id,10);  
            console.log("day la id:"+id);
            const User = await UserService.updateUser(id,req.body);
            const data = {
                "cod": 200,
                "message": "Cập nhật thành công",
                "data": User,
            }
            res.json(data);
        }
        catch (error) {
            console.log("Loi ne:",error);
            const data = {
                "cod": 500,
                "message": "Server error",
            }
            res.json(data);
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
    
}
export default UserApiController;
