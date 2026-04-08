import {
    Entity,
    ObjectIdColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { ObjectId } from "mongodb";

@Entity()
export class LeadershipRole {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    name: string;

    @Column({ default: 0 })
    isDelete: number;

    @Column({ default: "Active" })
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
