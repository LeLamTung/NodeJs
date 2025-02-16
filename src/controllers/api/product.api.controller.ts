import Products from "@entities/Products";
import ProductsService from "@services/product.service";
import { Request, Response } from "express";
class ProductsApiController {
    static async getAllProducts(req: Request, res: Response) {
        try {
            const Products: Products[] = await ProductsService.getAllProducts();
            const data = {
                "cod": 200,
                "data": Products,
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
    static async storeProducts(req: Request, res:Response) {
        try {
            const Products = await ProductsService.createProduct(req,res);
            const data = {
                "cod": 200,
                "message": "Thêm mới thành công",
                "data": Products,
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
    // static async updateProducts(req: Request, res: Response) {
    //     try {
    //         const id = parseInt(req.params.id, 10);
    //         const Products = await ProductsService.updateProduct(id,req,res);
    //         const data = {
    //             "cod": 200,
    //             "message": "Cập nhật thành công",
    //             "data": Products,
    //         }
    //         res.json(data);
    //     }
    //     catch (error) {
    //         const data = {
    //             "cod": 500,
    //             "message": "Server error",
    //         }
    //         res.json(data);
    //     }
    // }
    static async getDetailProduct(req: Request, res: Response) {
        try {
          const product = await ProductsService.getProductById(req, res);
          const data = {
            message: "Product fetched successfully",
            data: product,
          };
          res.json(data);
        } catch (err) {
          const data = {
            message: "Error fetching product",
          };
          res.json(data);
        }
      }
    static async deleteProducts(req: Request, res: Response) {
        try {
            const Products = await ProductsService.deleteProduct(req,res);
    
            // Nếu không tìm thấy Products để xóa
            if (!Products) {
                return res.status(404).json({
                    "cod": 404,
                    "message": "Không tìm thấy mặt hàng cần xóa",
                });
            }
    
            // Nếu xóa thành công
            const data = {
                "cod": 200,
                "message": "Xóa thành công",
                "data": Products,
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
export default ProductsApiController;
