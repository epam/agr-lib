import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('fin_users')
export class FinancialUsersEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({name: 'first_name'})
  firstName: string;
  @Column({name: 'last_name'})
  lastName: string;
  @Column({name:'birth_date',type:'date'})
  birthDate:Date;
}
