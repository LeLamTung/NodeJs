import Categories from "@entities/Categories";
import { AppDataSource } from "@databases/data-source";
import { Request,Response } from "express";
const CategoriesRepository = AppDataSource.getRepository(Categories);
class CategoriesService {
    static async getAllCategories(): Promise<Categories[]> {
        const data: any = await CategoriesRepository.find()
        return data;
    }
    static async createCategories(req: Request,res:Response) {
        const r1: Categories = new Categories();
        r1.CategoryName = req.body.CategoryName;
        r1.CategoryImage = req.file?.originalname;
        return await CategoriesRepository.save(r1);
    }
    static async deleteCategories(idCategory: number) {
        // Kiểm tra Categories có tồn tại không trước khi xóa
        const Categories = await CategoriesRepository.findOne({ where: { idCategory } });
        if (!Categories) {
            return null; // Trả về null nếu không tìm thấy
        }
        await CategoriesRepository.delete(idCategory);
        return Categories; // Trả về thông tin Categories đã xóa
    }
    
    
    static async updateCategories(idCategory:number,req:Request,res:Response):Promise<Categories> {
        const r1 = await CategoriesRepository.findOneBy({idCategory});
        if (!r1) throw new Error("Categories not found");
        r1.CategoryName = req.body.CategoryName || r1.CategoryName;
        r1.CategoryImage = req.file?.originalname || r1.CategoryImage;
        return await CategoriesRepository.save(r1);
    }
}
export default CategoriesService;