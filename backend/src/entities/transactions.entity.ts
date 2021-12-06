import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('fin_transactions')
export class TransactionsEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({name: 'fin_accounts__oid'})
  accountId: number;
  @Column({name: 'trans_date', type: 'date'})
  transactionDate: Date;
  @Column({name:'trans_amount'})
  transactionAmount:number;
  @Column({name:'fin_trans_types__id'})
  transactionTypeId:number;
  @Column()
  merchant:string;
}
