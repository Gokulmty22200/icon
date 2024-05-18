import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import ApexCharts from 'apexcharts';

import {MONTHS, YEARS, SCANTYPE } from '../../shared/constants/dashboard-constants';
import { DashboardService } from '../services/dashboard.service';
import { DataItem, DataItemMonthly, ScanData } from '../interface/dashboard.interface';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexGrid,
  ApexStroke,
  ApexTooltip,
  ApexNonAxisChartSeries,
  ApexFill
} from 'ng-apexcharts';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  colors: string[];
  grid: ApexGrid;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  fill: ApexFill;
};

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // private props
  @ViewChild('growthChart') growthChart: ChartComponent;
  chartOptions: Partial<ChartOptions>;
  @ViewChild('bajajchart') bajajchart: ChartComponent;
  chartOptions1: Partial<ChartOptions>;
  lineChart: Partial<ChartOptions>;
  pieChart: Partial<PieChartOptions>;
  scatterChart: Partial<ChartOptions>;
  barChart: Partial<ChartOptions>;

  monthsData = Object.values(MONTHS);
  yearData = Object.values(YEARS);
  scanType = Object.values(SCANTYPE);
  totalScanCount: number = 0;
  avgScanTime: string = '0:00';
  errorCount: number = 0;
  codeWiseErrorCount = [];
  codeWiseErrorCode = [];
  sortForm: FormGroup;
  selectedScanType: string = SCANTYPE.ABDOMEN;
  isBarReady: boolean = false;
  isPieReady: boolean = false;
  isLineReady: boolean = false;
  avgScanCount: number = 0;
  scanListGroup = [];
  monthChart: any;
  yearChart: any;
  colorChart = ['#673ab7'];

  // Constructor
  constructor( private dashboardService: DashboardService, private fb: FormBuilder) {
    // this.renderPieChart();
    // this.renderBarChart();
    // this.renderLineChart();
  }

  // Life cycle events
  ngOnInit(): void {
    this.getDashboardData();
    this.getMonthErrorCount();
    // this.testapi();

    this.sortForm = this.fb.group({
      month: ['12'], // Default value for month
      year: ['2023'] // Default value for year
    });
   
  }

  sortData(){
    const formData = this.sortForm.value;
    this.getDashboardData(formData);
  }

  isObjectEmpty(obj: object): boolean {
    return Object.keys(obj).length === 0;
  }

  getDashboardData(timelineData={month: '12', year: '2023'}){
    const isEmpty = this.isObjectEmpty(timelineData);
    forkJoin([
      this.dashboardService.getDashboardCardsData(timelineData, isEmpty),
      this.dashboardService.getDashboardReportsData(timelineData, isEmpty)
    ]).subscribe(
      ([response1,response2]) => {
        this.totalScanCount = response1[0].data[0].SCAN_COUNT !== null ? response1[0].data[0].SCAN_COUNT : 0;
        this.avgScanTime =  this.convertSecondsToMinutesAndSeconds(response1[1]?.data[0]?.SCAN_TIME);
        this.avgScanCount = response1[1]?.data[0]?.COUNT;
        this.errorCount = response1[2].data[0].COUNT !== null ? response1[2].data[0].COUNT : 0;
        this.sortCodeWiseErrorData(response2[0].data);
        this.sortAvgSnrData(response2[1].data);
        this.sortTopData(response2[2].data);
        this.selectedScanType = SCANTYPE.ABDOMEN;
      },
      error => {
        console.error('Error fetching data:', error);
        // Display error message or retry logic
      }
    );
  }

  convertSecondsToMinutesAndSeconds(data) {
    let minutes;
    let seconds;
    if(data){
    minutes = Math.floor(data / 60);
    seconds = Math.round(data % 60);
    seconds = seconds < 10 ? '0' + seconds : seconds.toString();
    minutes = minutes+':'+seconds;
    return minutes;
    }
    else {
      minutes = '0:00';
    return minutes;
    }
  }

  sortTopData(scanData){
    this.scanListGroup =[];
    scanData.forEach(data =>{
      data.AVG_SCAN_TIME = this.convertSecondsToMinutesAndSeconds(data.AVG_SCAN_TIME);
      this.scanListGroup.push(data);
    });

  }

  handleScanChange($event){
    const scanType: string = $event.target.value;
    const timeData = this.sortForm.value;
        this.dashboardService.getAverageScanTime(scanType,timeData)
      .subscribe((response: any) => {
        this.avgScanTime = this.convertSecondsToMinutesAndSeconds(response.data[0].SCAN_TIME);
        this.avgScanCount = response.data[0]?.COUNT;
      },
      error =>{
        //Error handling pending
        console.log(error);
      });
  }

  sortCodeWiseErrorData(errorData:{ [key: number]: DataItem }){
    const countArray: number[] = [];
    const errorCodeArray: string[] = [];
    
    Object.values(errorData).forEach(item => {
      countArray.push(item.COUNT);
      errorCodeArray.push('Error '+ item.ERROR_CODE);
    });
    this.renderPieChart(countArray,errorCodeArray);
    
  }

  renderPieChart(countArray=[],errorCodeArray=[]){
    this.pieChart = {
      series: countArray,
      chart: {
        width: 380,
        type: "pie"
      },
      title: {
        text: "Errors Overview",
        align: "left"
      },
      labels: errorCodeArray,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
    this.isPieReady = true;
  }

  // testapi() {
  //   this.dashboardService.testAPI()
  //     .subscribe((response: any) => {
  //      console.log('Test',response)
  //     },
  //     error =>{
  //       //Error handling pending
  //       console.log(error);
  //     });
    
  // }

  getMonthErrorCount(){
    this.dashboardService.getMonthErrorCount()
          .subscribe((response: any) => {
            this.renderBarChart(response.data);
        },
        error =>{
          //Error handling pending
          console.log(error);
        });
  }

  renderBarChart(responseData=[]){
    const data: { [key: number]: DataItemMonthly } = responseData
          const errorData: { [key: string]: number[] } = {};

          Object.values(data).forEach((item: DataItemMonthly) => {
            if (!errorData[item.ERROR_CODE]) {
              errorData[item.ERROR_CODE] = Array(12).fill(0); 
            }
            errorData[item.ERROR_CODE][parseInt(item.MONTH) - 1] += item.COUNT; 
          });
          
          const output = Object.entries(errorData).map(([errorCode, counts]) => {
            return {
              name: 'Error ' + errorCode,
              data: counts
            };
          });

    this.barChart = {
      series: output,
      chart: {
        type: "bar",
        height: 350,
        stacked: true
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      stroke: {
        width: 1,
        colors: ["#fff"]
      },
      title: {
        text: "Previous Year Error Report"
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'July', 'Aug','Sep','Oct','Nov','Dec'],
        labels: {
          formatter: function(val) {
            return val;
          }
        }
      },
      yaxis: {
        title: {
          text: undefined
        }
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return val + " Errors ";
          }
        }
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40
      }
    };
    this.isBarReady = true;
  }

  sortAvgSnrData(responseData){
    const data: { [key: number]: ScanData } = responseData;
    const avgArray: number[] = Object.values(data).map((item: ScanData) => {
    return Math.floor(item.AVG * 100) / 100;
    });
    this.renderLineChart(avgArray);
  }

  renderLineChart(lineData = []){
    this.lineChart = {
      series: [
        {
          name: "Scans",
          data: lineData
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Average SNR By Scan Type",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: this.scanType
      }
    };
    this.isLineReady = true;
  }

  displayMonths(event){
    const year = event.target.value;
    if(year === '2024'){
      this.monthsData = this.monthsData.slice(0, 4);
    }else {
      this.monthsData = Object.values(MONTHS);
    }
  }
}
