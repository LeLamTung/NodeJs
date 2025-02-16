import { AppDataSource } from "@databases/data-source";
import { Request, Response } from "express";
import Product from "@entities/Products";
import Image from "@entities/Images";
const ImageRepository = AppDataSource.getRepository(Image);
const ProductRepository = AppDataSource.getRepository(Product);

class ProductService {
    static async getAllProducts(): Promise<Product[]> {
        const data: any = await ProductRepository.find();
        return data;
    }
    static async createProduct(req: Request, res: Response) {
        const product = new Product();
        product.productName = req.body.productName;
        const percent = Number(req.body.salePercentage) || 0;
        const priceOriginal = Number(req.body.priceOriginal) || 0;
        const discount = (percent * priceOriginal) / 100;
        product.originalPrice = priceOriginal;
        product.salePercentage = req.body.salePercentage;
        product.salePrice = req.body.priceOriginal - discount;
        product.description = req.body.description || "Chưa có mô tả";
        product.isHome = req.body.isHome;
        product.isSales = req.body.isSales;
        product.Category = req.body.idCategoryidCategory;//Lưu category
        if (req.files != null && Array.isArray(req.files) && req.files.length > 0) {
            const rDefault = Number(req.body.rDefault) || 1;
            const uploadedFiles = req.files.map((file) => file.filename);
            if (rDefault < 1 || rDefault > uploadedFiles.length) {
                return res.status(400).json({
                    message: "Chỉ số ảnh chính không hợp lệ!",
                });
            }
            product.imageName = uploadedFiles[rDefault - 1];
            const imagesToSave: Image[] = [];
            req.files.forEach((file, index) => {
                const image = new Image();
                image.imageLink = file.filename;
                image.Product = product; // đây là lưu idProduct nhé nhé (không viết ghi chú đọc chắc chắn deo hiểu được)
                image.mainImage = index + 1 === rDefault;
                imagesToSave.push(image); // như đã được khai bảng Mảng ở trên ImageToSave sẽ lần lượt lưu từng ảnh
            });
            try {
                await ProductRepository.save(product);
                await ImageRepository.save(imagesToSave); // sau khi lưu từng ảnh sẽ lưu tất cảcả
            } catch (error) {
                console.error("Error saving product or images:", error);
                return res
                    .status(500)
                    .json({ message: "Lưu sản phẩm thất bại", error });
            }
        } else {
            await ProductRepository.save(product);
        }
    }
    static async getProductById(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const product = await ProductRepository.findOneBy({ idProduct: id });
        if (!product) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }
        return product;
    }

    static async deleteProduct(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const product = await ProductRepository.findOne({ where: { idProduct: id }, relations: ["image"], }); // relation để hiển thị ra tất cả các mối quan hệ của sản phẩmẩm
        if (!product) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }
        // vì là có quan hệ với "Image" và "category" nên không thể xóa được ("sẽ hiện thị là không thể xóa được vì idProduct còn liên quan đến ảnh và Category")

        if (product.images && product.images.length > 0) { // vì vậy nên cần phải xóa ảnh trước để "Product" không còn liên quan tới ảnh khác, ở đây là bảng "Image" 
            await ImageRepository.remove(product.images);
        }
        // sau khi đã xóa được ảnh thì "Product" sẽ không liên quan đến bảng nào nữa nên có thể xóa được nhé.
        try {
            await ProductRepository.remove(product);
        }
        catch (error) {
            console.error("Error deleting product:", error);
            return res
                .status(500)
                .json({ message: "Xóa sản phẩm thất bại", error });
        }
        return product;
    }
}
export default ProductService;
