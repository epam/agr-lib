import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppProgressSpinnerService {
  visible = false;
  constructor() { }
  show(){
    this.visible = true;
  }

  hide(){
    this.visible = false;
  }
}
