import { Entity, PrimaryGeneratedColumn, Column, Table, ManyToMany, ManyToOne, OneToMany, CreateDateColumn } from "typeorm"
import Users from "./Users"
import BillDetail from "./BillDetail"
import Products from "./Products"
@Entity({name: "bill"})
class Bill {
    @PrimaryGeneratedColumn()
    idBill?: number

    @Column()
    TotalBill?: number

    @CreateDateColumn()
    createdAt?: Date

    @ManyToOne(() => Users,(user:Users)=>user.idUser)
    idUser?: Users;

    @OneToMany(() => BillDetail,(billdetail:BillDetail) => billdetail.idBillDetail)
    idBillDetail?: BillDetail[];

    @OneToMany(() => Products,(products:Products) => products.idProduct)
    idProduct?: Products[];
}

export default Bill;
