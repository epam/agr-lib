import { Component } from '@angular/core';
import {AppProgressSpinnerService} from "./shared/app-progress-spinner/app-progress-spinner.service";

@Component({
  selector: 'agr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  constructor(public progressSpinner:AppProgressSpinnerService) {
  }
}
