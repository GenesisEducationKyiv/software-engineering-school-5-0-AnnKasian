import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Frequency } from "../enums/enums.js";

@Entity("subscription")
class SubscriptionEntity {
  constructor(entity?: Partial<SubscriptionEntity>) {
    Object.assign(this, entity);
  }

  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Index()
  @Column({
    length: 100,
    unique: true,
    type: "varchar",
  })
  public email!: string;

  @Generated("uuid")
  @Column({ type: "uuid", unique: true })
  public token!: string;

  @Column({ length: 100 })
  public city!: string;

  @Column({ type: "enum", enum: Frequency })
  public frequency!: Frequency;

  @Column({ type: "boolean", default: false })
  public confirmed?: boolean;

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  public createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  public updatedAt!: Date;
}

export { SubscriptionEntity };
