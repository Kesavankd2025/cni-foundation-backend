import {
    Entity,
    ObjectIdColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { ObjectId } from "mongodb";

@Entity()
export class LeadershipTeam {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    name: string;

    @Column({ nullable: true })
    roleId?: ObjectId;

    @Column({ nullable: true })
    about?: string;

    @Column("simple-json", { nullable: true })
    image?: {
        fileName?: string;
        path?: string;
        originalName?: string;
    };

    @Column({ default: "Active" })
    status: string;

    @Column({ default: 0 })
    isDelete: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
