import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('fin_accounts')
export class AccountsEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({name: 'fin_user__oid'})
  userId: number;
  @Column({name: 'acc_number'})
  accountNumber: string;
  @Column({name: 'fin_acc_types__id'})
  accountTypeId: number;
  @Column()
  balance: number;
  @Column({name: 'interest_rate'})
  rate: number
}
