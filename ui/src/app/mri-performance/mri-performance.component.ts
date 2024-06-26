import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, TemplateRef, ViewEncapsulation, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { catchError, interval, mergeMap, Subject, Subscription, takeUntil, throwError, timer } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { DynamicContentComponent } from '../dynamic-content/dynamic-content.component';
import { SharedService } from '../shared/services/shared.service';

@Component({
  selector: 'app-mri-performance',
  standalone: true,
  imports: [CommonModule, DynamicContentComponent],
  templateUrl: './mri-performance.component.html',
  styleUrl: './mri-performance.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MriPerformanceComponent implements OnInit{

  private modalService = inject(NgbModal);
  sampleData: any[] = [];
  fetchId = 1;
  errorDescData: any;
  selectedErrrorDesc: any = null;
  dataCount: number = 1;
  intervalSubscription: Subscription | undefined;
  tableData;

  constructor(private http: HttpClient,private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef, private sharedService: SharedService) { }
  
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  
  ngOnInit(): void {
    this.getErrorDescData();
    this.setupTable();
    
    const storedCount = localStorage.getItem('count');
    if (storedCount) {
      this.dataCount = parseInt(storedCount, 10);
    }
    // this.startCounter();
    // this.sharedService.setTableData('Clear');

    setTimeout(() => {
      this.cdr.detectChanges();
    }, 2000);
  }

  startCounter() {
    this.dataCount = 1;
    this.intervalSubscription = interval(2000).subscribe(() => {
      this.dataCount++;
      if (this.dataCount <= 275) {
        // this.dataCount = 1;
      this.setupTable();

      }
      // localStorage.setItem('count', this.dataCount.toString());
      // this.setupTable();
    });
  }

  // setupTable(){
  //   let selectedErrrorDesc;
  //   this.sharedService.getMRIPerformance(this.dataCount)
  //         .subscribe((response: any) => {
  //           if(response.meta.state !== 'ERROR'){
  //             if(response.data.machine_data.error_code !== 'No Error'){
  //               selectedErrrorDesc = this.errorDescData.find((entry: any) => entry.errorType == response.data.machine_data.error_code);
  //               response.data.machine_data.error_desc = selectedErrrorDesc.title;
  //               this.sharedService.setTableData(response.data);
  //             }
  //             this.sampleData.unshift(response.data);
  //             if (this.sampleData.length > 50) {
  //             this.sampleData.splice(-1, 1);
  //             }
  //           }
  //       },
  //       error =>{
  //         //Error handling pending
  //         console.log(error);
  //       });
  // }


  setupTable() {
    let selectedErrorDesc;
    let maintenanceCode;
    const performNextRequest = (count) => {
      if (count <= 275) {
        this.sharedService.getMRIPerformance(count)
          .pipe(
            catchError(error => {
              console.log(error);
              return timer(1000).pipe(
                mergeMap(() => throwError(error))
              );
            }),
            takeUntil(this.ngUnsubscribe)
          )
          .subscribe((response: any) => {
            if (response.meta.state !== 'ERROR' && response.meta?.state) {
              if (response.data.machine_data?.error_code !== 'No Error' && response.data.machine_data?.error_code !== 'NA') {
                selectedErrorDesc = this.errorDescData.find((entry: any) => entry.errorType == response.data.machine_data.error_code);
                if(selectedErrorDesc)
                  response.data.machine_data.error_desc = selectedErrorDesc.title;
                response.data.dataType = 'Error';
                this.sharedService.setTableData(response.data);
              }
              if (response.data.machine_data.maintenance_code !== 'Success' && response.data.machine_data.maintenance_code !== 'NA') {
                // maintenanceCode = this.errorDescData.find((entry: any) => entry.maintanence_code == response.data.machine_data.maintanence_code);
                // if(maintenanceCode)
                  response.data.dataType = 'MC';
                this.sharedService.setTableData(response.data);
              }
              this.sampleData.unshift(response.data);
              if (this.sampleData.length > 50) {
                this.sampleData.pop();
              }
              this.intervalSubscription = timer(2000).subscribe(() => performNextRequest(count + 1));
            } else if(response.meta.state === 'ERROR' || response.meta?.state === undefined){
              performNextRequest(count + 1);
            }
          });
      }
    };
    performNextRequest(1);
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

  openLg(content: TemplateRef<any>, tableData) {
    if(tableData.machine_data.error_code !== 'No Error'){
      this.setErrorDesc(tableData);
    }
		this.modalService.open(content, { size: 'lg' });
	}

  ngOnDestroy() {
    if (this.intervalSubscription) {
      console.log('Destroyed');
      this.intervalSubscription.unsubscribe();
      this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    }
  }
}
