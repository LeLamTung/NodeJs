import { Entity, PrimaryGeneratedColumn, Column, Table, ManyToMany, ManyToOne } from "typeorm"
import Bill from "./Bill"
@Entity({name: "billdetail"})
class BillDetail {
    @PrimaryGeneratedColumn()
    idBillDetail?: number

    @Column()
    Code?: string

    @Column()
    City?: string

    @Column()
    District?: string

    @Column()
    Street?: string

    @Column()
    Notes?: string

    @Column()
    ProductPrice?: number

    @Column()
    Quantity?: number

    @Column()
    Total?: number

    @ManyToOne(() => Bill,(bill:Bill)=>bill.idBillDetail)
    Bill?: Bill;
}

export default BillDetail;
