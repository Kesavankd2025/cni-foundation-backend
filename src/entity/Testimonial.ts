import {
    Entity,
    ObjectIdColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { ObjectId } from "mongodb";

@Entity("Testimonial")
export class Testimonial {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    customerName: string;

    @Column()
    designation: string;

    @Column()
    message: string;

    @Column("simple-json", { nullable: true })
    image?: {
        fileName?: string;
        path?: string;
        originalName?: string;
    };

    @Column({ default: 0 })
    isDelete: number;

    @Column({ default: 1 })
    isActive: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
