import {Injectable} from '@angular/core';
import formatISO from 'date-fns/formatISO'
import {MedicalRecord} from "./section-grid/medicalRecord";

@Injectable({
  providedIn: 'root'
})
export class MapperService {

  constructor() {
  }

  static simpleTable(data) {
    const properties = ['temperature0900', 'temperature1400', 'temperature1800', 'temperature2100',
      'hemoglobin', 'wbc', 'mcv', 'pcv', 'rbc', 'mch', 'mchc', 'rdw', 'neutrophils', 'lymphocytes', 'monocytes', 'eosinophils',
      'basophils']
    return data.map((item, index) => {
      for (const prop of properties) {
        item.index = index+1;
        item[prop] = parseFloat(item[prop]);
      }
      return item;
    });
  }

  static updateSimpleTable(updateInfo: Partial<MedicalRecord>) {
    const clone = {...updateInfo};
    Object.keys(clone).forEach((key) => {
      switch (key) {
        case 'birthDate':
        case 'measurementDate':
          clone[key] = formatISO(clone[key] as Date, {representation: 'date'})
          break;
      }
    })
    return clone;
  }

  static getAccounts(data) {
    return data.map((item) => {
      item.rate = (parseFloat(item.rate) * 100).toFixed(1);
      return item;
    })
  }
}
