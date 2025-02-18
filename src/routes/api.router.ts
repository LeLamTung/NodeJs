import express, { Express, NextFunction, Request, Response, Router } from "express";
import RoleApiController from "@controllers/api/role.api.controller";
import CategoriesApiController from "@controllers/api/category.api.controller";
import UserApiController from "@controllers/api/user.api.controller";
import upload from "@middlewares/upload.middleware";
import { verifyToken } from "@middlewares/verifyToken";
const app: Express = express();
const router: Router = express.Router();

//Login
router.post('/admin/user/login', (req: Request, res:Response)=>{
    UserApiController.login(req, res);
});
//ROLEROLE
router.use(verifyToken);
router.get('/admin/role/list', (req: Request, res: Response) => {
    RoleApiController.getAllRoles(req, res);
});
router.post('/admin/role/create', (req: Request, res: Response) => {
    RoleApiController.storeRole(req, res);
});
router.put('/admin/role/edit/:id', (req: Request, res: Response) => {
    RoleApiController.updateRole(req, res);
});
router.delete('/admin/role/delete/:id', (req: Request, res: Response) => {
    RoleApiController.deleteRole(req, res);
});
//CATEGORY
router.get('/admin/categories/list', (req: Request, res: Response) => {
    CategoriesApiController.getAllCategories(req, res);
});
router.post('/admin/categories/create',upload.single("CategoryImage"), (req: Request, res: Response) => {
    CategoriesApiController.storeCategories(req, res);
});
router.put('/admin/categories/edit/:id',upload.single("CategoryImage"), (req: Request, res: Response) => {
    CategoriesApiController.updateCategories(req, res);
});
router.delete('/admin/categories/delete/:id', (req: Request, res: Response) => {
    CategoriesApiController.deleteCategories(req, res);
});
// PRODUCT
//User
router.get('/admin/user/list', (req: Request, res: Response) => {
    UserApiController.getAllUsers(req, res);
});
router.post('/admin/user/create', (req: Request, res: Response) => {
    UserApiController.storeUser(req, res);
});
router.put('/admin/user/edit/:id', (req: Request, res: Response) => {
    UserApiController.updateUser(req, res);
});
router.delete('/admin/user/delete/:id', (req: Request, res: Response) => {
    UserApiController.deleteUser(req, res);
});
//Login

export default router;