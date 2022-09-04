import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {MedicalEntity} from "./entities/medical.entity";
import {Repository} from "typeorm";
import {UpdateMedicalDto} from "./dto/create-medical.dto";

@Injectable()
export class AppService {
  constructor(@InjectRepository(MedicalEntity) public  medicalRepository:Repository<MedicalEntity>) {
  }
  getSimpleTable():Promise<MedicalEntity[]> {
    return this.medicalRepository.find();
  }

  updateSimpleTable(id:string,update:UpdateMedicalDto){
    return this.medicalRepository.update(id,update)
  }
}
