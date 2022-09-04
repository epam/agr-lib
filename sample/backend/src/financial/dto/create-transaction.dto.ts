import {PartialType} from "@nestjs/mapped-types";

export class CreateTransactionDto {
  transactionTypeId:number;
}

export class UpdateTransactionDto extends PartialType(CreateTransactionDto){

}
