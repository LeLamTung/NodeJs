import express, { Express, Request, Response, Router } from "express";
import HomeController from "@controllers/home.controller";
const router: Router = express.Router();
import { checkAuth } from "@middlewares/checkAuth";
import { isAdmin } from "@middlewares/isAdmin";
import UserApiController from "@controllers/api/user.api.controller";
router.get('/register',(req:Request, res:Response) => {
    HomeController.showFormRegister(req, res);
})
router.get('/login',(req:Request, res:Response) => {
    HomeController.showFormLogin(req, res);
})
router.post('/login',(req:Request, res:Response) => {
    HomeController.login(req, res);
})
router.post('/register',(req:Request, res:Response) => {
    HomeController.register(req, res);
})
router.get('/home',checkAuth, (req: Request, res: Response) => {
    HomeController.index(req, res);
});
router.get('/list',checkAuth,isAdmin, (req: Request, res: Response) =>{
    HomeController.list(req, res);
})
router.get('/logout',(req:Request,res:Response)=>{
    HomeController.logout(req,res);
})
router.post('/api/admin/user/login', (req: Request, res:Response)=>{
    UserApiController.login(req, res);
});
export default router;