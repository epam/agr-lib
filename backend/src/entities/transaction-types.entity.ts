import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('fin_trans_types')
export class TransactionTypesEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({name: 'type'})
  transactionType: string;
}
