import { Entity, PrimaryGeneratedColumn, Column, Table, ManyToMany, ManyToOne, OneToMany } from "typeorm"
import Images from "./Images"
import Categories from "./Categories"
import Bill from "./Bill"
@Entity({name: "products"})
class Products {
    @PrimaryGeneratedColumn()
    idProduct?: number

    @Column()
    productName?: string

    @Column()
    imageName?: string

    @Column()
    originalPrice?: number

    @Column()
    salePrice?: number

    @Column()
    salePercentage?: number

    @Column()
    description?: string

    @Column()
    isSales?: boolean

    @Column()
    isHome?: boolean

    @Column()
    status?: boolean

    @ManyToOne(() => Categories,(categories:Categories)=>categories.products)
    Category?: Categories;

    @OneToMany(() => Images,(images:Images)=>images.Product)
    images?: Images[];

    @ManyToOne(() => Bill,(bill:Bill)=>bill.idBill)
    bill?: Bill;
}

export default Products;
