import {PartialType} from "@nestjs/mapped-types";

export class CreateAccountDto {
  accountTypeId:number;
}

export class UpdateAccountDto extends  PartialType(CreateAccountDto){

}
