import {PartialType} from "@nestjs/mapped-types";

export class CreateMedicalDto {
  firstName:string;
  birthDate:Date;
}

export class UpdateMedicalDto extends PartialType(CreateMedicalDto){

}
