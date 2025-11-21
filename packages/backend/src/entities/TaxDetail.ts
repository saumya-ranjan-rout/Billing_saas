import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Invoice } from './Invoice';

@Entity('tax_details')
export class TaxDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  taxName: string;

  @Column('decimal', { precision: 6, scale: 2 })
  taxRate: number;

  @Column('decimal', { precision: 15, scale: 2 })
  taxAmount: number;

  @Column('decimal', { precision: 15, scale: 2 })
  taxableValue: number;

    @Column({ type: 'boolean', default: false })
  hasCess: boolean;

  @Column('decimal', { precision: 6, scale: 2, default: 0 })
  cessRate: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  cessAmount: number;

//   @ManyToOne(() => Invoice, invoice => invoice.taxDetails)
//   invoice: Invoice;
  @ManyToOne(() => Invoice, invoice => invoice.taxDetails, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'invoiceId' })
invoice: Invoice;

  @Column()
  invoiceId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
