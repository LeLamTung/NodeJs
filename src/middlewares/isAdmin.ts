import { NextFunction, Request, Response } from "express"
export const isAdmin = (req: any, res: Response, next: NextFunction) => {
    const { userLogin } = req.session;
    const currentRoleID = userLogin.role.idRole;
    console.log('currentRoleID', currentRoleID);
    if (currentRoleID == 1) {
        next();
    } else {
        res.render('error/403.ejs');
    }
}