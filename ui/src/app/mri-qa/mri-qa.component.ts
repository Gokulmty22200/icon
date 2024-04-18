import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from '../shared/services/shared.service';

@Component({
  selector: 'app-mri-qa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mri-qa.component.html',
  styleUrl: './mri-qa.component.scss'
})
export class MriQaComponent implements OnInit {

  qaTestData: any[] = [];
  qaOutputData: any[] = [];

  constructor(private http: HttpClient, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.setupQaTestsTable();
    this.setupOutputTable();
  }

  setupQaTestsTable(){
    this.http.get<any[]>('/assets/sample-data/mri-qa-sample-data.json').subscribe(data => {
      this.qaTestData = data;
    });
  }

  setupOutputTable(){
    this.sharedService.getQaResponse()
          .subscribe((response: any) => {
            this.qaOutputData = response.data;
        },
        error =>{
          //Error handling pending
          console.log(error);
          this.http.get<any[]>('/assets/sample-data/mri-qa-output.json').subscribe(data => {
            this.qaOutputData = data;
          });
        });
  }

}
