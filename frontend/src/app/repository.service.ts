import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {

  constructor(private fetcher:HttpClient) {
  }

  getSimpleTable(){
    return this.fetcher.get('/api/simple-table',{observe:'body',responseType: 'json'})
  }
}
