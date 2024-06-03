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
  selectedMinor;
  minorErrorData;

  constructor(private sharedService: SharedService, private http: HttpClient) { }


  ngOnInit(): void {
    this.sharedService.tableData$.subscribe(data => {
      if(data && data !== 'Clear'){
        if(data.dataType === 'Error'){
          const errorCodeExists = this.notifications.some(notification => notification.machine_data.error_code === data.machine_data.error_code);
          if (!errorCodeExists) {
            this.notifications.push(data);
          }
        } else if(data.dataType === 'MC'){
        this.preventiveNotifications.push(data);
      }
      }
      else{
        this.notifications = [];
        this.setPreventiveNotifications();
      }
    });
    this.getPreventiveNotifications();
    this.getErrorDescData();
    this.getMinorDescData();
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
      "scan_minutes": (tableData.machine_data.scan_time / 60).toFixed(2),
      "mri_inlet_temp": parseFloat(tableData.chiller_data.max_water_inlet_temp).toFixed(2),
      "mri_outlet_temp": parseFloat(tableData.chiller_data.max_water_outlet_temp).toFixed(2),
      "mri_water_pressure": parseFloat(tableData.chiller_data.min_water_pressure).toFixed(3),
      "max_iaq_temp": parseFloat(tableData.iaq_data.max_temperature).toFixed(2),
      "relative_iaq_humidity": parseFloat(tableData.iaq_data.max_rel_humidity).toFixed(2)
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
          /snr_data|scan_type|drift_hz|drift_ppm|coil_type|slice_thickness|grad_perf|sys_temp|cyro_boiloff|scan_time|scan_minutes|mri_inlet_temp|mri_outlet_temp|mri_water_pressure|max_iaq_temp|relative_iaq_humidity/g,
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
    }else if(type === 'pm'){
      this.selectedPm = tableData;
      this.modalService.open(content, { size: 'lg' });
    } else {
      this.setMinorDesc(tableData);
      this.modalService.open(content, { size: 'lg' });
    }
	}

  getMinorDescData(): any{
    this.http.get<any[]>('/assets/sample-data/minor-and-major-error-data.json').subscribe(data => {
      this.minorErrorData = data;
    });
  }

  setMinorDesc(tableData: any){
    this.selectedMinor = this.minorErrorData.find((entry: any) => entry.error == tableData.machine_data.maintenance_code);
    this.selectedMinor.steps = tableData.steps;
    this.selectedMinor.max_water_inlet_temp = parseFloat(tableData.chiller_data.max_water_inlet_temp).toFixed(2);
    this.selectedMinor.max_water_outlet_temp = parseFloat(tableData.chiller_data.max_water_outlet_temp).toFixed(2);
    this.selectedMinor.min_water_pressure = parseFloat(tableData.chiller_data.min_water_pressure).toFixed(3);
    this.selectedMinor.max_temperature = parseFloat(tableData.iaq_data.max_temperature).toFixed(2);
    this.selectedMinor.max_rel_humidity = parseFloat(tableData.iaq_data.max_rel_humidity).toFixed(2);
  }

  getMaintenanceName(code: string): string{
    const entry = this.minorErrorData.find((entry: any) => entry.error === code);
    return entry ? entry.title : 'NA';
  }

  logout(){
    localStorage.clear();
  }
}
