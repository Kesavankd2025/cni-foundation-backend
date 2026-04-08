import {
    Entity,
    ObjectIdColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { ObjectId } from "mongodb";

@Entity()
export class Gallery {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    title: string;

    @Column()
    type: string; // "Photo" | "Video"

    @Column({ default: false })
    isMultiple: boolean;

    @Column("simple-json", { nullable: true })
    media?: {
        fileName?: string;
        path?: string;
        originalName?: string;
        url?: string;
    }[];

    @Column({ nullable: true })
    about?: string;

    @Column({ default: "Active" })
    status: string;

    @Column({ default: 0 })
    isDelete: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
