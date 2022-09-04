import {PartialType} from "@nestjs/mapped-types";

export class CreateUserDto{
  firstName: string;
  lastName:string;
}

export class UpdateUserDto extends PartialType(CreateUserDto){

}
