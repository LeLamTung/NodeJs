import Role from "@entities/Role";
import { AppDataSource } from "@databases/data-source";
const roleRepository = AppDataSource.getRepository(Role);
class RoleService {
    static async getAllRoles(): Promise<Role[]> {
        const data: any = await roleRepository.find()
        return data;
    }
    static async createRole(data: any) {
        const { nameRole } = data;
        const r1: Role = new Role();
        r1.nameRole = nameRole;
        return await roleRepository.save(r1);
    }
    static async deleteRole(idRole: number) {
        // Kiểm tra role có tồn tại không trước khi xóa
        const role = await roleRepository.findOne({ where: { idRole } });
        if (!role) {
            return null; // Trả về null nếu không tìm thấy
        }
        await roleRepository.delete(idRole);
        return role; // Trả về thông tin role đã xóa
    }
    
    
    static async updateRole(idRole:number , data: any):Promise<Role> {
        const {  nameRole } = data;
        console.log("Role update",data)
        const r1 = await roleRepository.findOneBy({idRole});
        if (!r1) throw new Error("Role not found");
        r1.nameRole = nameRole || r1.nameRole;
        return await roleRepository.save(r1);
    }
}
export default RoleService;