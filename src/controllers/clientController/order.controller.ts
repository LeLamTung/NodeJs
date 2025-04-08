import { Request, Response } from "express";
import OrderService from "@services/clientServices/order.service"; // Giả sử bạn có service xử lý logic cho Order
import { IncomingMessage } from "http"; // hoặc dùng 'https' nếu cần

class OrderController {
  // Tạo đơn hàng mới
  static async createOrder(req: Request, res: Response) {
    try {
      // Gọi OrderService để xử lý logic tạo đơn hàng
      const order = await OrderService.createOrder(req, res);

      // Phản hồi sau khi tạo thành công
      const data = {
        message: "Order created successfully",
        data: order,
      };
      res.status(201).json(data); // Trả về mã 201 khi tạo thành công
    } catch (err) {
      // Xử lý lỗi nếu có
      console.log(err);
      res.status(500).json({ message: "Error creating order" });
    }
  }
  static async testMoMo(): Promise<void> {
   
}
}

export default OrderController;
