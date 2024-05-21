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
  errorDescData;
  preventiveNotifications=[];
  preventiveNotificationsData=[];
  selectedPm;
  active = 1;
  tableData;

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
    this.preventiveNotifications = this.preventiveNotificationsData;
  }
  
  getErrorDescData(){
    this.http.get<any[]>('/assets/sample-data/error-description.json').subscribe(data => {
      this.errorDescData = data;
    });
  }

  setErrorDesc(tableData){
    this.tableData = tableData;
    let replacements: { [key: string]: string }= {
      "Date_value": tableData.machine_data.Date,
      "scan_type": tableData.machine_data.scan_type,
      "scan_time": tableData.machine_data.scan_time,
      "snr_data": tableData.machine_data.snr,
      "drift_hz": tableData.machine_data.drift_hz,
      "drift_ppm": tableData.machine_data.drift_ppm,
      "grad_perf": tableData.machine_data.grad_perf,
      "coil_type": tableData.machine_data.coil_type,
      "error_temp": tableData.machine_data.error_temp,
      "sys_temp": tableData.machine_data.sys_temp,
      "cyro_boiloff": tableData.machine_data.cryo_boiloff,
      "rf_power": tableData.machine_data.rf_power,
      "grad_temp": tableData.machine_data.grad_temp,
      "grad_current": tableData.machine_data.grad_current,
      "x_axis_pos": tableData.machine_data.x_axis_pos,
      "y_axis_pos": tableData.machine_data.y_axis_pos,
      "z_axis_pos": tableData.machine_data.z_axis_pos,
      "error_code": tableData.machine_data.error_code,
      "slice_thickness": tableData.machine_data.slice_thickness,
      "scan_time_minutes": (tableData.machine_data.scan_time / 60).toString()

    };
    let replacedTitle;
    let replacedText;
    let replacedTable;
    let selectedErrrorDesc;
      selectedErrrorDesc = this.errorDescData.find((entry: any) => entry.errorType == tableData.machine_data.error_code);
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
          /snr_data|scan_type|drift_hz|drift_ppm|coil_type|slice_thickness|grad_perf|sys_temp|cyro_boiloff|scan_time|scan_time_minutes/g,
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
      if(tableData.machine_data.error_code !== 'No Error'){
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
