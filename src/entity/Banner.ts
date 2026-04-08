import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ObjectId } from "mongodb";

@Entity("Banner")
export class Banner {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column("simple-json", { nullable: true })
  bannerImage?: {
    fileName?: string;
    path?: string;
    originalName?: string;
  };

  @Column({ default: 1 })
  isActive: number;

  @Column({ default: 0 })
  isDelete: number;

  @Column({ default: 0 })
  order: number;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  subTitle?: string;

  @Column({ nullable: true })
  buttonLink?: string;

  @Column({ nullable: true })
  link?: string;

  @Column({ nullable: true })
  expiryDate?: Date;

  @Column()
  createdBy: ObjectId;

  @Column()
  updatedBy: ObjectId;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
