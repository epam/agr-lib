import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('fin_acc_types')
export class AccountTypesEntity{
  @PrimaryGeneratedColumn()
  id:number;
  @Column({name:'acc_type'})
  accountType:string;
}
