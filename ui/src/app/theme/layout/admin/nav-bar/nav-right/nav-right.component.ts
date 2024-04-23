// Angular import
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent implements OnInit{
  private modalService = inject(NgbModal);
  notifications= [];
  selectedErrrorDesc;
  errrorDescData;
  preventiveNotifications=[];
  preventiveNotificationsData=[];
  selectedPm;

  constructor(private sharedService: SharedService, private http: HttpClient) { }


  ngOnInit(): void {
    this.sharedService.tableData$.subscribe(data => {
      if(data && data !== 'Clear'){
        this.notifications.push(data);
      }else{
        this.notifications = [];
        this.setPreventiveNotifications();
      }
    });
    this.getPreventiveNotifications();
    this.getErrorDescData();
  }

  getPreventiveNotifications(){
    this.http.get<any[]>('/assets/sample-data/preventive-maintanence.json').subscribe(data => {
      this.preventiveNotificationsData = data;
      this.setPreventiveNotifications();
    });
  }

  setPreventiveNotifications(){
    console.log(this.preventiveNotificationsData);
    this.preventiveNotifications = this.preventiveNotificationsData;
  }
  
  getErrorDescData(){
    this.http.get<any[]>('/assets/sample-data/error-description.json').subscribe(data => {
      this.errrorDescData = data;
    });
  }

  setErrorDesc(tableData){
    let replacements: { [key: string]: string }= {
      "Date_value": tableData.Date,
      "scan_type": tableData.scan_type,
      "scan_time": tableData.scan_time,
      "snr_data": tableData.snr,
      "drift_hz": tableData.drift_hz,
      "drift_ppm": tableData.drift_ppm,
      "grad_perf": tableData.grad_perf,
      "coil_type": tableData.coil_type,
      "error_temp": tableData.error_temp,
      "sys_temp": tableData.sys_temp,
      "cyro_boiloff": tableData.cyro_boiloff,
      "rf_power": tableData.rf_power,
      "grad_temp": tableData.grad_temp,
      "grad_current": tableData.grad_current,
      "x_axis_pos": tableData.x_axis_pos,
      "y_axis_pos": tableData.y_axis_pos,
      "z_axis_pos": tableData.z_axis_pos,
      "error_code": tableData.error_code
    };
    let replacedTitle;
    let replacedText;
    let replacedTable;
    let selectedErrrorDesc;
      selectedErrrorDesc = this.errrorDescData.find((entry: any) => entry.errorType == tableData.error_code);
      if(selectedErrrorDesc.isTitleChangeRequied){
        replacedTitle = selectedErrrorDesc.title.replace(
          /scan_type/g,
          match => replacements[match]
        );
        selectedErrrorDesc.title = replacedTitle;
        selectedErrrorDesc.isTitleChangeRequied = false;
      }
      if(selectedErrrorDesc.isDescChangeRequied){
        replacedText = selectedErrrorDesc.description.replace(
          /snr_data|scan_type|drift_hz|drift_ppm|coil_type/g,
          match => replacements[match]
        );
        selectedErrrorDesc.description = replacedText;
        selectedErrrorDesc.isDescChangeRequied = false;
      }
      replacedTable = selectedErrrorDesc.tableHtml.replace(
        /Date_value|snr_data|scan_type|scan_time|drift_hz|drift_ppm|grad_perf|coil_type|error_temp|sys_temp|cyro_boiloff|rf_power|grad_temp|grad_current|x_axis_pos|y_axis_pos|z_axis_pos|error_code/g,
        match => replacements[match]
      );
      selectedErrrorDesc.tableHtml = replacedTable;
      this.selectedErrrorDesc = selectedErrrorDesc;
  }

  openPopUp(content: TemplateRef<any>, tableData, type: string) {
    if(type === 'error'){
      if(tableData.error_code !== 'No Error'){
        this.setErrorDesc(tableData);
      }
      this.modalService.open(content, { size: 'lg' });
    }else{
      this.selectedPm = tableData;
      this.modalService.open(content, { size: 'lg' });
    }
	}


  logout(){
    localStorage.clear();
  }
}
