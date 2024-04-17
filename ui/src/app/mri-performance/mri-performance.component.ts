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
    this.intervalSubscription = interval(5000).subscribe(() => {
      this.dataCount++;
      if (this.dataCount > 50) {
        this.dataCount = 1;
      }
      localStorage.setItem('count', this.dataCount.toString());
      this.setupTable();
    });
  }

  setupTable(){
    this.sharedService.getMRIPerformance(this.dataCount)
          .subscribe((response: any) => {
            this.dataCount++;
            this.sampleData.unshift(response.data);
            if (this.sampleData.length > 10) {
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
      "snr_data": tableData.current_data.snr,
      "scan_type": tableData.current_data.scan_type,
      "drift_hz": tableData.current_data.drift,
      "drift_ppm": tableData.current_data.drift_ppm,
      "coil_type": tableData.current_data.coil_type
    };
    let replacedTitle;
    let replacedText;
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
      this.selectedErrrorDesc = selectedErrrorDesc;
  }

  openLg(content: TemplateRef<any>, tableData) {
    if(tableData.preds !== 'No Error'){
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
