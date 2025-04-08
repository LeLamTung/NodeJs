import { AppDataSource } from "@databases/data-source";
import { Request, Response } from "express";
import Order from "@entities/Order";
import OrderDetail from "@entities/OrderDetail";
import Products from "@entities/Products"; // Giả sử bạn có model Product

const OrderDetailRepository = AppDataSource.getRepository(OrderDetail);
const OrderRepository = AppDataSource.getRepository(Order);

class OrderService {
  static async createOrder(req: Request, res: Response) {
    const { CustomerName, PhoneNumber, Address, Notes, PaymentMethod } = req.body;
  
    // Kiểm tra xem giỏ hàng có trong session không
    if (!req.session.cart || req.session.cart.length === 0) {
      throw new Error("Giỏ hàng trống!");
    }
  
    // Lấy thông tin giỏ hàng và tính tổng giá
    let totalPrice = 0;
    const orderDetails: OrderDetail[] = [];
  
    for (let item of req.session.cart) {
      // Lấy thông tin sản phẩm từ idProduct trong giỏ hàng
      const product = await AppDataSource.getRepository(Products).findOne({
        where: { idProduct: item.productId },
      });
  
      if (!product) {
        throw new Error(`Sản phẩm ID ${item.productId} không tồn tại!`);
      }
  
      // Lấy giá trị từ sản phẩm
      const price = product?.SalePrice;
      const quantity = item?.quantity;
  
      if (price !== undefined && quantity !== undefined) {
        const itemTotalPrice = price * quantity;
        totalPrice += itemTotalPrice;
  
        // Tạo OrderDetail cho từng sản phẩm trong giỏ hàng
        const orderDetail = new OrderDetail();
        orderDetail.Product = product; // Liên kết với sản phẩm
        orderDetail.ProductName = product.ProductName; // Lấy tên sản phẩm từ sản phẩm
        orderDetail.ProductImage = product.ImageName; // Lấy hình ảnh sản phẩm từ sản phẩm
        orderDetail.Quantity = item.quantity;
        orderDetail.Price = price;
        orderDetail.TotalPrice = itemTotalPrice; // Tổng giá của từng sản phẩm
        orderDetails.push(orderDetail);
      } else {
        console.error("Giá hoặc số lượng không hợp lệ", product, item);
      }
    }
  
    // Tạo Order mới
    const order = new Order();
    order.CustomerName = CustomerName;
    order.PhoneNumber = PhoneNumber;
    order.Address = Address;
    order.Notes = Notes;
    order.TotalPrice = totalPrice;
    order.PaymentMethod = PaymentMethod;
    order.Status = 1; // Giả sử trạng thái đơn hàng là 1 (Chờ xử lý)
  
    // Lưu Order vào cơ sở dữ liệu
    await OrderRepository.save(order);
  
    // Lưu OrderDetail vào cơ sở dữ liệu
    for (let detail of orderDetails) {
      detail.Order = order; // Liên kết OrderDetail với Order
      await OrderDetailRepository.save(detail);
    }
  
    // Sau khi tạo đơn hàng xong, xóa giỏ hàng trong session
    req.session.cart = [];
  
    // Trả về thông tin đơn hàng đã tạo
    return order;
  }
  
}

export default OrderService;
