import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import ApexCharts from 'apexcharts';

import {MONTHS, YEARS } from '../../shared/constants/dashboard-constants'

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
import { HttpClient } from '@angular/common/http';
import { OutputData, RefineData } from '../interface/dashboard.interface';
import { SharedService } from 'src/app/shared/services/shared.service';

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
  selector: 'app-live-dashboard',
  standalone: true,
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './live-dashboard.component.html',
  styleUrl: './live-dashboard.component.scss'
})
export class LiveDashboardComponent {
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

monthChart: any;
yearChart: any;
colorChart = ['#673ab7'];
scatterData: any;
isScatterReady: boolean = false;
  // Constructor
  constructor(private http: HttpClient,private sharedService: SharedService) {
    this.getScatterData();
  }

  // Life cycle events
  ngOnInit(): void {
  }

  refineData(data: OutputData[]){
    const refinedData: { component_name: string; urgency: number; impact_value: number }[] = [];
    const groupedData: { [key: string]: [number, number][] } = {};
    const chartData: RefineData[] = [];

    data.forEach(item => {
      if(!item.Components.toLowerCase().includes('not applicable')){
      // const componentName = item.Components.split(' ').slice(0, 2).join(' ');
      const namesArray = item.Components.split('**, **').map(name => name.replace(/\*\*/g, ''));
      // console.log('comp',componentName, namesArray);
      const urgency = item.Urgency === 'immediate'? 0 : parseInt(item.Urgency.replace(' days', ''));
      let impactValue: number;
      if(item.Impact){
      switch (item.Impact.toLowerCase()) {
        case 'critical':
          impactValue = 0;
          break;
        case 'high':
          impactValue = 1;
          break;
        case 'moderate':
          impactValue = 2;
          break;
        case 'medium':
          impactValue = 3;
          break;
        case 'low':
          impactValue = 4;
          break;
        default:
          impactValue = 0;
      }
    }else{
      impactValue = 4
    }
      if(namesArray.length > 1){
        namesArray.forEach(data => {
          refinedData.push({ component_name: data, urgency: urgency, impact_value: impactValue });
        });
      }else {
        refinedData.push({ component_name: namesArray[0], urgency: urgency, impact_value: impactValue });
      }
      }
    });

    refinedData.forEach(item => {
      if (!groupedData[item.component_name]) {
        groupedData[item.component_name] = [];
      }
      groupedData[item.component_name].push([item.impact_value, item.urgency]);
    });
  
    // Convert grouped data to the desired format
    for (const name in groupedData) {
      if (groupedData.hasOwnProperty(name)) {
        chartData.push({ name: name, data: groupedData[name] });
      }
    }
  
    this.scatterData =  chartData;
    this.renderScatterChart();
  }

  getScatterData(){
    this.isScatterReady = false;

    this.http.get<any[]>('/assets/sample-data/live-scatter.json').subscribe(data => {
      this.refineData(data);
    });

    //Using static Data for Easy loading
    // this.sharedService.getQaResponse()
    //       .subscribe((response: any) => {
    //         if(response.data){
    //           this.refineData(response.data);
    //         }
    //       },
    //           error =>{
    //             //Error handling pending
    //             console.log(error);
    //           });
        }

  renderScatterChart(){
    const impactData = {
      high: 1,
      medium: 2,
      moderate: 3,
      low: 4
    };

    this.scatterChart = {
      series: this.scatterData,
      chart: {
        height: 350,
        type: 'scatter',
        zoom: {
          enabled: true,
          type: 'xy'
        }
      },
      xaxis: {
        type:"numeric",
        tickAmount: 3,
        labels: {
          formatter: function(val) {
            if(val == '1'){
              return 'High';
            }else if(val == '2'){
              return 'Medium';
            }else if(val == '3'){
              return 'Moderate';
            }else if(val == '4'){
              return 'Low';
            }else if(val == '0'){
              return 'Critical';
            }else{
              return parseFloat(val).toFixed(1)
            }
          }
        }
      },
      yaxis: {
        tickAmount: 5
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return val + " Days ";
          }
        }
      },
    };
    this.isScatterReady = true;
  }
}
