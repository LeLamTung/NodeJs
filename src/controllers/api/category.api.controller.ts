import Categories from "@entities/Categories";
import CategoriesService from "@services/category.service";
import { Request, Response } from "express";
class CategoriesApiController {
    static async getAllCategories(req: Request, res: Response) {
        try {
            const Categories: Categories[] = await CategoriesService.getAllCategories();
            const data = {
                "cod": 200,
                "data": Categories,
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
    static async storeCategories(req: Request, res:Response) {
        try {
            const Categories = await CategoriesService.createCategories(req,res);
            const data = {
                "cod": 200,
                "message": "Thêm mới thành công",
                "data": Categories,
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
    static async updateCategories(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id, 10);
            const Categories = await CategoriesService.updateCategories(id,req,res);
            const data = {
                "cod": 200,
                "message": "Cập nhật thành công",
                "data": Categories,
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
    static async deleteCategories(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id, 10);    
            const Categories = await CategoriesService.deleteCategories(id);
    
            // Nếu không tìm thấy Categories để xóa
            if (!Categories) {
                return res.status(404).json({
                    "cod": 404,
                    "message": "Không tìm thấy thể loại cần xóa",
                });
            }
    
            // Nếu xóa thành công
            const data = {
                "cod": 200,
                "message": "Xóa thành công",
                "data": Categories,
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
export default CategoriesApiController;
