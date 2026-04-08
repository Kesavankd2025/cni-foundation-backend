import {
    Entity,
    ObjectIdColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { ObjectId } from "mongodb";

@Entity()
export class Blog {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    title: string;

    @Column({ nullable: true })
    shortDescription?: string;

    @Column()
    description: string;

    @Column({ nullable: true })
    location?: string;

    @Column({ nullable: true })
    publishDate?: Date;

    @Column({ nullable: true })
    startTime?: string;

    @Column({ nullable: true })
    endTime?: string;

    @Column({ nullable: true })
    categoryId?: ObjectId;

    @Column({ nullable: true })
    slug?: string;

    @Column({ nullable: true })
    metaTitle?: string;

    @Column({ nullable: true })
    metaDescription?: string;

    @Column({ nullable: true })
    metaKeywords?: string;

    @Column({ default: "Active" })
    status: string;

    @Column("simple-json", { nullable: true })
    image?: {
        fileName?: string;
        path?: string;
        originalName?: string;
    };

    @Column({ default: 0 })
    isDelete: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
