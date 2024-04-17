import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, TemplateRef, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { interval, Subscription } from 'rxjs';
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
  errrorDescData: any;
  selectedErrrorDesc: any = null;
  dataCount: number = 1;
  intervalSubscription: Subscription | undefined;

  constructor(private http: HttpClient,private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.getErrorDescData();
    this.setupTable();
    
    const storedCount = localStorage.getItem('count');
    if (storedCount) {
      this.dataCount = parseInt(storedCount, 10);
    }
    this.startCounter();

    setTimeout(() => {
      this.cdr.detectChanges();
    }, 2000);
  }

  startCounter() {
    this.dataCount = 1;
    this.intervalSubscription = interval(2000).subscribe(() => {
      this.dataCount++;
      if (this.dataCount <= 50) {
        // this.dataCount = 1;
      this.setupTable();

      }
      // localStorage.setItem('count', this.dataCount.toString());
      // this.setupTable();
    });
  }

  setupTable(){
    let selectedErrrorDesc;
    this.sharedService.getMRIPerformance(this.dataCount)
          .subscribe((response: any) => {
            if(response.data.current_data.error_code !== 'No Error'){
      selectedErrrorDesc = this.errrorDescData.find((entry: any) => entry.errorType == response.data.current_data.error_code);
              response.data.current_data.error_desc = selectedErrrorDesc.title;
              this.sharedService.setTableData(response.data.current_data);
            }
            this.sampleData.unshift(response.data);
            if (this.sampleData.length > 50) {
            this.sampleData.splice(-1, 1);
            }
        },
        error =>{
          //Error handling pending
          console.log(error);
        });
  }

  getErrorDescData(){
    this.http.get<any[]>('/assets/sample-data/error-description.json').subscribe(data => {
      this.errrorDescData = data;
    });
  }

  setErrorDesc(tableData){
    let replacements: { [key: string]: string }= {
      "Date_value": tableData.current_data.Date,
      "scan_type": tableData.current_data.scan_type,
      "scan_time": tableData.current_data.scan_time,
      "snr_data": tableData.current_data.snr,
      "drift_hz": tableData.current_data.drift_hz,
      "drift_ppm": tableData.current_data.drift_ppm,
      "grad_perf": tableData.current_data.grad_perf,
      "coil_type": tableData.current_data.coil_type,
      "error_temp": tableData.current_data.error_temp,
      "sys_temp": tableData.current_data.sys_temp,
      "cyro_boiloff": tableData.current_data.cyro_boiloff,
      "rf_power": tableData.current_data.rf_power,
      "grad_temp": tableData.current_data.grad_temp,
      "grad_current": tableData.current_data.grad_current,
      "x_axis_pos": tableData.current_data.x_axis_pos,
      "y_axis_pos": tableData.current_data.y_axis_pos,
      "z_axis_pos": tableData.current_data.z_axis_pos,
      "error_code": tableData.current_data.error_code
    };
    let replacedTitle;
    let replacedText;
    let replacedTable;
    let selectedErrrorDesc;
      selectedErrrorDesc = this.errrorDescData.find((entry: any) => entry.errorType == tableData.current_data.error_code);
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

  openLg(content: TemplateRef<any>, tableData) {
    if(tableData.current_data.error_code !== 'No Error'){
      this.setErrorDesc(tableData);
    }
		this.modalService.open(content, { size: 'lg' });
	}

  ngOnDestroy() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }
}
