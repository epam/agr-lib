import {Body, Controller, Get, Param, Patch, Put} from '@nestjs/common';
import { AppService } from './app.service';
import {UpdateMedicalDto} from "./dto/create-medical.dto";

@Controller('/api/simple-table')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getSimpleTable() {
    return this.appService.getSimpleTable();
  }

  @Patch(':id')
  putSimpleTable(@Param('id') id:string, @Body() body:UpdateMedicalDto) {
    console.log(body)
    return this.appService.updateSimpleTable(id,body);
  }
}
