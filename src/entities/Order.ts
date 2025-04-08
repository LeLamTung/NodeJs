import { Entity, PrimaryGeneratedColumn, Column, Table, ManyToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import OrderDetail from "./OrderDetail"
import Users from "./Users"
@Entity({name: "Order"})
class Order {
    @PrimaryGeneratedColumn()
    idOrder?: number

    @Column()
    CustomerName?: string

    @Column()
    PhoneNumber?: string

    @Column()
    Address?: string

    @Column()
    Notes?: string

    @Column("decimal")
    TotalPrice?: number

    @Column()
    PaymentMethod?: string

    @Column()
    Status?: number

    @CreateDateColumn()
    CreatedAt?: Date

    @UpdateDateColumn()
    UpdateAt?: Date

    @OneToMany(() => OrderDetail,(OrderDetail:OrderDetail) => OrderDetail.Order, {
        cascade: true,
        onDelete: 'CASCADE', // quan trọng
      })
    OrderDetail?: OrderDetail[]; 

}

export default Order;
