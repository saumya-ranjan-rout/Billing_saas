import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Entity('freeGST')
export class FreeGST {
  @PrimaryGeneratedColumn('uuid')
  id: string;
 @Column({ type: 'varchar', length: 255, nullable: false })
  fullName: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  phone: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  
}
