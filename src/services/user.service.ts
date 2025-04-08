import User from "@entities/Users";
import Role from "@entities/Role";
import bcrypt from "bcrypt";
import { AppDataSource } from "@databases/data-source";

const roleRepository = AppDataSource.getRepository(Role);
const userRepository = AppDataSource.getRepository(User);
class UserService {
    static async getAllUsers(): Promise<User[]> {
        const data: any = await userRepository.find(
            {
                relations: ["Role"],
            }
        )
        console.log(data);
        return data;
    }
    static async getUserById(id: number): Promise<User | null> {
        try {
            const user = await userRepository.findOneBy({ idUser: id });

            if (!user) {
                throw new Error("User không tồn tại");
            }

            return user;
        } catch (error) {
            console.error("Lỗi khi lấy thông tin user:", error);
            throw new Error("Lỗi khi lấy thông tin user");
        }
    }
    static async createUser(data: any) {
        const { UserName, Email, Password, IsActive } = data
        const u1: User = new User();
        u1.UserName = UserName;
        u1.Email = Email;
        // Mã hóa mật khẩu nè
        u1.Password = await bcrypt.hash(Password, 10);
        u1.IsActive = IsActive ? IsActive : true;
        const role = await roleRepository.findOne({
            where: {
                NameRole: 'Customer',
            },
        });
        if (role) {
            u1.Role = role;
        }
        return await userRepository.save(u1);
    }
    static async deleteUser(id: any) {
        return await userRepository.delete(id);
    }



    static async updateUser(data: any): Promise<User> {
        const { idUser, UserName, Email, Password, IsActive } = data;
        if (!idUser) throw new Error("Thiếu ID người dùng");

        const user = await userRepository.findOneBy({ idUser });
        if (!user) throw new Error("User không tồn tại");

        user.UserName = UserName || user.UserName;
        user.Email = Email || user.Email;
        if (Password) {
            user.Password = Password; // Hash password nếu cần
        }
        user.IsActive = IsActive ?? user.IsActive;

        return await userRepository.save(user);
    }

    static async getAccountbyEmailandPassword(data: any): Promise<any> {
        const { Email, Password } = data;

        // Tìm user theo email
        const user = await userRepository.findOne({
            where: { Email: Email },
            relations: ["Role"],
        });
        console.log(user);        

        if (!user) return null; // Không tìm thấy user

        // So sánh mật khẩu nhập vào với mật khẩu đã băm
        if (!Password || !user.Password) {
            throw new Error("Password is missing or invalid");
        }
        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) return null; // Sai mật khẩu

        return user; // Trả về user nếu đúng mật khẩu
    }

}

export default UserService;