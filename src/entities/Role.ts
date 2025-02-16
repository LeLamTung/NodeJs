import { Entity, PrimaryGeneratedColumn, Column, Table, OneToMany } from "typeorm"
import User from "./Users";

@Entity({ name: "roles" })
class Role {
    @PrimaryGeneratedColumn()
    idRole?: number;

    @Column()
    nameRole?: string;

    @OneToMany(()=> User,(user:User)=> user.role)
    users?: User[];
}
export default Role;
