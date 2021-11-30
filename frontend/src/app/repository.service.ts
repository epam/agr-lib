import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  private options = {
    observe: 'body' as const,
    responseType: 'json' as const
  };

  constructor(private fetcher: HttpClient) {
  }

  getSimpleTable() {
    return this.fetcher.get('/api/simple-table', this.options)
  }

  updateSimpleTable(id:string,body: any) {
    console.log(body)
    return this.fetcher.patch(`/api/simple-table/${id}`, body, this.options)
  }
}
