import {
    Entity,
    ObjectIdColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { ObjectId } from "mongodb";

@Entity("Event")
export class Event {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    title: string;

    @Column({ nullable: true })
    shortDescription?: string;

    @Column()
    details: string;

    @Column()
    venue: string;

    @Column({ nullable: true })
    location?: string;

    @Column()
    date: Date;

    @Column({ nullable: true })
    startTime?: string;

    @Column({ nullable: true })
    endTime?: string;

    @Column("simple-json", { nullable: true })
    image?: {
        fileName: string;
        path: string;
        originalName: string;
    };

    @Column({ default: 0 })
    isDelete: number;

    @Column({ default: 1 })
    isActive: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    createdBy: ObjectId;

    @Column()
    updatedBy: ObjectId;
}
