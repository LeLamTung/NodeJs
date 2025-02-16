import { Entity, PrimaryGeneratedColumn, Column, Table, ManyToMany, ManyToOne, OneToMany, CreateDateColumn } from "typeorm"
import Role from "./Role"
import Bill from "./Bill"
@Entity({name: "users"})
class Users {
    @PrimaryGeneratedColumn()
    idUser?: number

    @Column()
    UserName?: string

    @Column({
        unique: true,
    })
    email?: string

    @Column()
    password?: string

    @Column()
    isActive?: boolean

    @CreateDateColumn()
    createdAt?: Date

    @ManyToOne(() => Role,(role:Role)=>role.users)
    role?: Role;

    @OneToMany(() => Bill,(bill:Bill)=>bill.idUser)
    bill?: Bill[];
}

export default Users;
