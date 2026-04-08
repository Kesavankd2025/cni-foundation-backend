import {
    Entity,
    ObjectIdColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { ObjectId } from "mongodb";

@Entity()
export class InternshipEnquiry {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    fullName: string;

    @Column()
    phoneNumber: string;

    @Column()
    email: string;

    @Column()
    college: string;

    @Column()
    course: string;

    @Column()
    areaOfInterest: string;

    @Column({ nullable: true })
    resumeLink: string;

    @Column()
    motivation: string;

    @Column({ default: 0 })
    isDelete: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
