import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {MedicalEntity} from "./entities/medical.entity";
import {Repository} from "typeorm";

@Injectable()
export class AppService {
  constructor(@InjectRepository(MedicalEntity) public  medicalRepository:Repository<MedicalEntity>) {
  }
  getSimpleTable():Promise<MedicalEntity[]> {
    return this.medicalRepository.find();
  }
}
