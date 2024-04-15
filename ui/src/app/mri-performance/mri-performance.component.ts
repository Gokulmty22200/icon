import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, TemplateRef, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { DynamicContentComponent } from '../dynamic-content/dynamic-content.component';

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

  constructor(private http: HttpClient,private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getErrorDescData();
    this.setupTable();
    
    interval(3000).subscribe(() => {
      if(this.fetchId < 10){
      this.setupTable();
    }
    });

    setTimeout(() => {
      // Manually trigger change detection after updating dynamicData
      this.cdr.detectChanges();
    }, 2000);
  }

  setupTable(){
    this.http.get<any[]>('/assets/sample-data/mri-performance.json').subscribe(data => {
      this.sampleData.unshift(data.find((entry: any) => entry.s_no === this.fetchId));

      if (this.sampleData.length > 5) {
        this.sampleData.splice(-1, 1);
      }
      this.fetchId++;
    });
  }

  getErrorDescData(){
    this.http.get<any[]>('/assets/sample-data/error-description.json').subscribe(data => {
      this.errrorDescData = data;
    });
  }

  setErrorDesc(tableData){
    let replacements: { [key: string]: string }= {
      "snr_data": tableData.snr,
      "scan_type": tableData.scan_type,
      "drift_hz": tableData.drift,
      "drift_ppm": tableData.drift_ppm,
      "coil_type": tableData.coil_type
    };
    let replacedTitle;
    let replacedText;
    let selectedErrrorDesc;
      selectedErrrorDesc = this.errrorDescData.find((entry: any) => entry.errorType === tableData.preds);
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
}
