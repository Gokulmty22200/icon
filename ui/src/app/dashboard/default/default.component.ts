import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { DashboardComponent } from '../dashboard/dashboard.component';
import { LiveDashboardComponent } from '../live-dashboard/live-dashboard.component';


@Component({
  selector: 'app-default',
  standalone: true,
  imports: [SharedModule, NgApexchartsModule, DashboardComponent, LiveDashboardComponent,NgbNavModule],
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export default class DefaultComponent {

  dashboardTab:boolean = true; 
  activeTab: string = 'tab1';
  active = 1;
  changeTab(status:boolean, tabType: string){
    this.dashboardTab = status;
    this.activeTab = tabType;
  }
}
