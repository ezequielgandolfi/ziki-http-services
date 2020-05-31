import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpDataService } from './services/data-injection.service';

let _dataService: HttpDataService;
export function DataService(): HttpDataService {
  return _dataService;
}

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule
  ],
  providers: [
    HttpDataService
  ]
})
export class ZikiHttpServicesModule { 
  constructor(private dataServices: HttpDataService) {
    _dataService = this.dataServices;
  }
}
