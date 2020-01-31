import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpDataService } from './services/data-injection.service';

export let DATA_SERVICE: HttpDataService;

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
    DATA_SERVICE = this.dataServices;
  }

  get DataService(): HttpDataService {
    return DATA_SERVICE;
  }

}
