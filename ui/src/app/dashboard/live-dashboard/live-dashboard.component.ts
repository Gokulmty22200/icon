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
  constructor(private http: HttpClient) {
    this.getScatterData();

    this.chartOptions = {
      series: [
        {
          name: "Scans",
          data: [21, 22, 10, 28, 16]
        }
      ],
      chart: {
        height: 350,
        type: "bar",
        events: {
          click: function(chart, w, e) {
            // console.log(chart, w, e)
          }
        }
      },
      colors: [
        "#008FFB",
        "#00E396",
        "#FEB019",
        "#FF4560",
        "#775DD0",
        "#546E7A",
        "#26a69a",
        "#D10CE8"
      ],
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      grid: {
        show: false
      },
      xaxis: {
        categories: [
          "Head",
          "Abdomen",
          "Leg",
          "Spinal",
          "Chest"
        ],
        labels: {
          style: {
            colors: [
              "#008FFB",
              "#00E396",
              "#FEB019",
              "#FF4560",
              "#775DD0",
              "#546E7A",
              "#26a69a",
              "#D10CE8"
            ],
            fontSize: "12px"
          }
        }
      }
    };
    this.chartOptions1 = {
      chart: {
        type: 'area',
        height: 95,
        stacked: true,
        sparkline: {
          enabled: true
        }
      },
      colors: ['#673ab7'],
      stroke: {
        curve: 'smooth',
        width: 1
      },

      series: [
        {
          data: [0, 15, 10, 50, 30, 40, 25]
        }
      ]
    };
    this.lineChart = {
      series: [
        {
          name: "Desktops",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
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
        text: "Product Trends by Month",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: [
          "Head",
          "Leg",
          "Abdom",
          "Spine",
          "Neck",
          "Hand",
          "Hip",
          "Pelvic",
          "Chest"
        ]
      }
    };
    this.pieChart = {
      series: [44, 55, 13, 43, 22],
      chart: {
        width: 380,
        type: "pie"
      },
      title: {
        text: "Errors Overview",
        align: "center"
      },
      labels: ["Error 1", "Error 2", "Error 3", "Error 4", "Error 5"],
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


    this.barChart = {
      series: [
        {
          name: "Error 1",
          data: [4, 1, 2, 0, 2, 3, 1,2,3,6,1]
        },
        {
          name: "Error 2",
          data: [5, 2, 0, 1, 1, 3, 2,2,3,6,1]
        },
        {
          name: "Error 3",
          data: [9, 1, 1, 9, 1, 5, 0,2,3,6,1]
        },
        {
          name: "Error 4",
          data: [9, 7, 5, 8, 6, 9, 4,2,3,6,1]
        },
        {
          name: "Error 5",
          data: [2, 1, 1, 3, 2, 2, 1,2,3,6,1]
        }
      ],
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
        text: "Error Monthly Report"
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
  }

  // Life cycle events
  ngOnInit(): void {
    // setTimeout(() => {
    //   this.monthChart = new ApexCharts(document.querySelector('#tab-chart-1'), this.monthOptions);
    //   this.monthChart.render();
    // }, 500);
  }

  // public Method
  onNavChange(changeEvent: NgbNavChangeEvent) {
    if (changeEvent.nextId === 1) {
      setTimeout(() => {
        this.monthChart = new ApexCharts(document.querySelector('#tab-chart-1'), this.monthOptions);
        this.monthChart.render();
      }, 200);
    }

    if (changeEvent.nextId === 2) {
      setTimeout(() => {
        this.yearChart = new ApexCharts(document.querySelector('#tab-chart-2'), this.yearOptions);
        this.yearChart.render();
      }, 200);
    }
  }

  public generateDayWiseTimeSeries(baseval, count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push([baseval, y]);
      baseval += 86400000;
      i++;
    }
    console.log(series);
    return series;
  }

  ListGroup = [
    {
      name: 'Bajaj Finery',
      profit: '10% Profit',
      invest: '$1839.00',
      bgColor: 'bg-light-success',
      icon: 'ti ti-chevron-up',
      color: 'text-success'
    },
    {
      name: 'TTML',
      profit: '10% Loss',
      invest: '$100.00',
      bgColor: 'bg-light-danger',
      icon: 'ti ti-chevron-down',
      color: 'text-danger'
    },
    {
      name: 'Reliance',
      profit: '10% Profit',
      invest: '$200.00',
      bgColor: 'bg-light-success',
      icon: 'ti ti-chevron-up',
      color: 'text-success'
    },
    {
      name: 'ATGL',
      profit: '10% Loss',
      invest: '$189.00',
      bgColor: 'bg-light-danger',
      icon: 'ti ti-chevron-down',
      color: 'text-danger'
    },
    {
      name: 'Stolon',
      profit: '10% Profit',
      invest: '$210.00',
      bgColor: 'bg-light-success',
      icon: 'ti ti-chevron-up',
      color: 'text-success'
    }
  ];


  ScanListGroup = [
    {
      name: 'Scan 5',
      type: 'Head',
      time: '25 Mins'
    },
    {
      name: 'Scan 11',
      type: 'Abdomen',
      time: '30 Mins'
    },
    {
      name: 'Scan 79',
      type: 'Leg',
      time: '35 Mins'
    },
    {
      name: 'Scan 137',
      type: 'Head',
      time: '44 Mins'
    },
    {
      name: 'Scan 200',
      type: 'Chest',
      time: '47 Mins'
    }
  ];

  monthOptions = {
    chart: {
      type: 'line',
      height: 90,
      sparkline: {
        enabled: true
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#FFF'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    series: [
      {
        name: 'series1',
        data: [45, 66, 41, 89, 25, 44, 9, 54]
      }
    ],
    yaxis: {
      min: 5,
      max: 95
    },
    tooltip: {
      theme: 'dark',
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: function (seriesName) {
            return 'Total Hours';
          }
        }
      },
      marker: {
        show: false
      }
    }
  };

  yearOptions = {
    chart: {
      type: 'line',
      height: 90,
      sparkline: {
        enabled: true
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#FFF'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    series: [
      {
        name: 'series1',
        data: [35, 44, 9, 54, 45, 66, 41, 69]
      }
    ],
    yaxis: {
      min: 5,
      max: 95
    },
    tooltip: {
      theme: 'dark',
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: function (seriesName) {
            return 'Total Earning';
          }
        }
      },
      marker: {
        show: false
      }
    }
  };

  refineData(data: OutputData[]){
    const refinedData: { component_name: string; urgency: number; impact_value: number }[] = [];
    const groupedData: { [key: string]: [number, number][] } = {};
    const chartData: RefineData[] = [];
    
    data.forEach(item => {
      if(item.Components !== 'Not applicable'){
      const componentName = item.Components.split(' ').slice(0, 2).join(' ');
      const urgency = parseInt(item.Urgency.replace(' days', ''));
      let impactValue: number;
      switch (item.Impact.toLowerCase()) {
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
          impactValue = 0; // Default value if not recognized
      }
      refinedData.push({ component_name: componentName, urgency: urgency, impact_value: impactValue });
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
