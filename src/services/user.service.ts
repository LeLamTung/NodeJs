import User from "@entities/Users";
import Role from "@entities/Role";
import { AppDataSource } from "@databases/data-source";
const roleRepository = AppDataSource.getRepository(Role);
const userRepository = AppDataSource.getRepository(User);
class UserService{
    static async getAllUsers(): Promise<User[]> {
        const data: any = await userRepository.find()
        // console.log(data);
        return data;
    }
    static async createUser(data: any) {
        const { UserName , email, password, isActive } = data
        const u1: User = new User();
        u1.UserName = UserName;
        u1.email = email;
        u1.password = password;
        u1.isActive = isActive ? isActive : false;
        const role = await roleRepository.findOne({
            where: {
                idRole: 2,
            },
        });
        if (role) {
            u1.role = role;
        }
        return await userRepository.save(u1);
    }
    static async deleteUser(id: any) {
        return await userRepository.delete(id);
    }

    static async updateUser(idUser:number,data: any): Promise<User> {
        const {  UserName, email, password, isActive } = data
        const user = await userRepository.findOneBy({ idUser });
        if (!user) throw new Error("User not found")
        user.UserName = UserName || user.UserName
        user.email = email || user.email
        user.password = password || user.password  // not update password if not provided in request
        user.isActive = isActive || user.isActive
        return await userRepository.save(user)
    }
    static async getAccountbyEmailandPassword(data: any): Promise<any> {
        const { email, password } = data
        return await userRepository.findOne({
            where: {
                email: email,
                password: password,
            },
            relations: ["role"],
        });
    }
}

export default UserService;