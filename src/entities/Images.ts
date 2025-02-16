import { Entity, PrimaryGeneratedColumn, Column, Table, ManyToMany, ManyToOne } from "typeorm"
import Products from "./Products"
@Entity({name: "images"})
class Images {
    @PrimaryGeneratedColumn()
    idImage?: number

    @Column()
    imageLink?: string

    @Column()
    mainImage?: boolean

    @ManyToOne(() => Products,(products:Products)=>products.images)
    Product?: Products; 
}

export default Images;
