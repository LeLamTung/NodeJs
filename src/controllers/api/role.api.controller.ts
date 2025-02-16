import Role from "@entities/Role";
import RoleService from "@services/role.service";
import { Request, Response } from "express";
class RoleApiController {
    static async getAllRoles(req: Request, res: Response) {
        try {
            const roles: Role[] = await RoleService.getAllRoles();
            const data = {
                "cod": 200,
                "data": roles,
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
    static async storeRole(req: Request, res:Response) {
        try {
            const Role = await RoleService.createRole(req.body);
            const data = {
                "cod": 200,
                "message": "Thêm mới thành công",
                "data": Role,
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
    static async updateRole(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id,10);  
            console.log("day la id:"+id);
            const role = await RoleService.updateRole(id,req.body);
            const data = {
                "cod": 200,
                "message": "Cập nhật thành công",
                "data": role,
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
    static async deleteRole(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id, 10);    
            const role = await RoleService.deleteRole(id);
    
            // Nếu không tìm thấy role để xóa
            if (!role) {
                return res.status(404).json({
                    "cod": 404,
                    "message": "Không tìm thấy vai trò cần xóa",
                });
            }
    
            // Nếu xóa thành công
            const data = {
                "cod": 200,
                "message": "Xóa thành công",
                "data": role,
            }
            return res.status(200).json(data);
        }
        catch (error) {
            console.error("Lỗi khi xóa vai trò:", error);
            return res.status(500).json({
                "cod": 500,
                "message": "Server error",
            });
        }
    }
    
}
export default RoleApiController;
