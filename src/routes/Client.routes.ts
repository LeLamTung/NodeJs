import express, { Express, Router } from "express";
import CartController from "@controllers/clientController/cart.controller";
import upload from "@middlewares/upload.middleware";
import OrderController from "@controllers/clientController/order.controller";
// import ProductsApiController from "@controllers/api/product.api.controller";
// import CategoriesApiController from "@controllers/api/category.api.controller";
import ProductsClientController from "@controllers/clientController/product.controler";
import CategoriesClientController from "@controllers/clientController/category.controller";
import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
const axios = require("axios");
const app: Express = express();
const routerClient = express.Router();

routerClient.post("/cart/addtoCart", upload.none(), (req, res) => {
  console.log("card added", req.body);
  CartController.AddtoCart(req, res);
});
routerClient.get("/cart/ListItem", (req, res) => {
  CartController.GetCart(req, res);
});

routerClient.post("/order/Checkout", (req, res) => {
  OrderController.createOrder(req, res);
});
routerClient.put("/cart/updateQuantity", upload.none(), (req, res) => {
  CartController.updateProductQuantity(req, res);
});
routerClient.delete("/cart/remove/:id", (req, res) => {
  CartController.removeProductFromCart(req, res);
});
routerClient.get("/product/list", (req, res) => {
  ProductsClientController.getAllProducts(req, res);
});
routerClient.get("/product/list/:id", (req, res) => {
  ProductsClientController.getProductById(req, res);
});
routerClient.get("/category/list", (req, res) => {
  CategoriesClientController.getAllCategories(req, res);
});
const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
var accessKey = "F8BBA842ECF85";
var secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
routerClient.post(
  "/testmomo",
  asyncHandler(async (req: Request, res: Response) => {
    // https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
    // parameters

    var orderInfo = "pay with MoMo";
    var partnerCode = "MOMO";
    var redirectUrl = "http://localhost:3001";
    var ipnUrl =
      "https://85ad-2405-4802-500d-5630-569-6cd9-dc38-4f06.ngrok-free.app/api/client/callback";
    var requestType = "payWithMethod";
    var amount = "50000";
    var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;
    var extraData = "";
    var paymentCode =
      "T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==";
    var orderGroupId = "";
    var autoCapture = true;
    var lang = "vi";

    //before sign HMAC SHA256 with format
    var rawSignature =
      "accessKey=" +
      accessKey +
      "&amount=" +
      amount +
      "&extraData=" +
      extraData +
      "&ipnUrl=" +
      ipnUrl +
      "&orderId=" +
      orderId +
      "&orderInfo=" +
      orderInfo +
      "&partnerCode=" +
      partnerCode +
      "&redirectUrl=" +
      redirectUrl +
      "&requestId=" +
      requestId +
      "&requestType=" +
      requestType;
    console.log("--------------------RAW SIGNATURE----------------");
    console.log(rawSignature);

    const crypto = require("crypto");
    var signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");
    console.log("--------------------SIGNATURE----------------");
    console.log(signature);

    const requestBody = {
      partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId,
      amount, // là number, không phải string!
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang,
      requestType,
      autoCapture,
      extraData,
      orderGroupId,
      signature,
    };
    try {
      const result = await axios.post(
        "https://test-payment.momo.vn/v2/gateway/api/create",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.status(200).json(result.data);
    } catch (error: any) {
      console.error("MoMo API Error:", error.response?.data || error.message);
      return res.status(500).json({
        statusCode: 500,
        message: "MoMo API Error",
        error: error.response?.data || error.message,
      });
    }
  })
);
routerClient.post( "/callback", asyncHandler((req: Request, res: Response) => {
    console.log("callback đây nè ", req.body);
    return res.status(200).json(req.body);
  })
);
routerClient.post("/transaction-status", asyncHandler( async (req: Request, res: Response) => {
    const { orderId } = req.body;
    console.log("transaction-status", req.body);
    const rawSignature =`accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`
    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = {
      partnerCode: "MOMO",
      requestId: orderId,
      orderId: orderId,
      signature: signature,
      lang: "vi",
    };
    try {
      const result = await axios.post(
        "https://test-payment.momo.vn/v2/gateway/api/query",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.status(200).json(result.data);
    } catch (error: any) {
      console.error("MoMo API Error:", error.response?.data || error.message);
      return res.status(500).json({
        statusCode: 500,
        message: "MoMo API Error",
        error: error.response?.data || error.message,
      });
    }
  })
);
export default routerClient;
