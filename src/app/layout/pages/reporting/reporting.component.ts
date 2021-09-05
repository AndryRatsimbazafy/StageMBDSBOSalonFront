import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType, RadialChartOptions } from 'chart.js';
import { Color, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, MultiDataSet, SingleDataSet } from 'ng2-charts';
import { DashboardService } from 'src/app/core/service/dashboard.service';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent implements OnInit {

  /**
   * visit by content
   */
  public doughnutChartLabels: Label[] = ['1', '2', '3', '4']
  public doughnutChartData: MultiDataSet = [
    [350, 450, 100],
    [50, 150, 120],
    [250, 130, 70],
    [250, 130, 70],
  ];
  public doughnutChartType: ChartType = 'doughnut';


  /**
   * visit by designer
   */
  public polarAreaChartLabels: Label[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '15', '16', '17', '18']
  public polarAreaChartData: SingleDataSet = [300, 500, 100, 40, 120, 300, 500, 100, 40, 120, 33, 33, 33, 33, 22, 22, 22, 22];
  public polarAreaLegend = true;
  public polarAreaChartType: ChartType = 'polarArea';


  /**
   * visit by content by ages
   */
  public radarChartOptions: RadialChartOptions = {
    responsive: true,
  };
  public radarChartLabels: Label[] = ['1', '2', '3', '4'];
  public radarChartData: ChartDataSets[] = [
    { data: [1, 2, 3, 4, 5, 6], label: '1' },
    { data: [1, 2, 3, 4, 5, 6], label: '2' },
    { data: [1, 2, 3, 4, 5, 6], label: '3' },
    { data: [1, 2, 3, 4, 5, 6], label: '4' },
  ];
  public radarChartType: ChartType = 'radar';


  /**
   * Top visit content by ages
   */
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];


  /**
   * visit by content per hour
   */
  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
  ];
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions: any = {
    responsive: true,
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];


  /**
   * Users by ages by gender
   */
  public barChartOptions2: ChartOptions = {
    responsive: true,
  };
  public barChartType2: ChartType = 'bar';
  public barChartLegend2 = true;
  public barChartPlugins2 = [];
  public barChartLabels2: Label[] = ['1', '2', '3', '4', '5', '6']
  public barChartData2: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27], label: 'Series B' },
    { data: [28, 48, 40, 19, 86, 27], label: 'Series C' }
  ];


  /**
   * Users by ages
   */
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = ['1', '2', '3', '4', '5', '6']
  public pieChartData: SingleDataSet = [300, 500, 100, 4, 5, 6];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public lineChartLabels2: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions2: any = {
    responsive: true,
  };
  public lineChartColors2: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend2 = true;
  public lineChartType2 = 'line';
  public lineChartPlugins2 = [];


  /**
   * Contents
   */
  contents = []
  dailyVisits = []

  constructor(private dashboardService: DashboardService) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit(): void {
    this.dashboardService.visitByAsset().subscribe(data => {
      if (data) {
        this.contents = data.visitByAssets
      }
    })

    this.dashboardService.visitAssetPerDays().subscribe(data => {
      if (data) {
        this.dailyVisits = data.visitPerDays[0]
      }
    })

    this.dashboardService.visitByAssetType().subscribe(data => {
      if (data) {
        this.doughnutChartLabels = ['Flyer', 'Video', 'Galerie', 'Chat'];
        this.doughnutChartData = [
          [data.flyerCount, data.videoCount, data.galerieCount, data.chatCount],
        ];
      }
    })

    this.dashboardService.visitTimeByExposant().subscribe(data => {
      if (data) {
        this.polarAreaChartLabels = data.visitTimeByExposant.map(e => e._id);
        this.polarAreaChartData = data.visitTimeByExposant.map(e => (e.visitTime / 3600).toFixed(2));
      }
    })

    this.dashboardService.visitAssetTypeByAges().subscribe(data => {
      if (data) {
        this.radarChartLabels = ['<30', '30-40', '40-45', '45-50', '50-55', '>55'];
        this.radarChartData = [
          { data: [data.video.a30, data.video.a3040, data.video.a4045, data.video.a4550, data.video.a5055, data.video.a55], label: 'video' },
          { data: [data.flyer.a30, data.flyer.a3040, data.flyer.a4045, data.flyer.a4550, data.flyer.a5055, data.flyer.a55], label: 'flyer' },
          { data: [data.galerie.a30, data.galerie.a3040, data.galerie.a4045, data.galerie.a4550, data.galerie.a5055, data.galerie.a55], label: 'galerie' },
          { data: [data.chat.a30, data.chat.a3040, data.chat.a4045, data.chat.a4550, data.chat.a5055, data.chat.a55], label: 'chat' },
        ];
      }
    })

    this.dashboardService.visitByAges().subscribe(data => {
      if (data) {
        this.barChartLabels = ['<30', '30-40', '40-45', '45-50', '50-55', '>55'];
        this.barChartData = [
          { data: [data.a30, data.a3040, data.a4045, data.a4550, data.a5055, data.a55], label: 'visites' }
        ];
      }
    })

    this.dashboardService.visitByAssetsPerHours().subscribe(data => {
      if (data) {
        const keys = []
        const values = []
        for (const key in data.visitPerHours[0]) {
          if (Object.prototype.hasOwnProperty.call(data.visitPerHours[0], key)) {
            const element = data.visitPerHours[0][key];
            keys.push(key)
            values.push(element)
          }
        }
        this.lineChartData = [
          { data: values, label: 'visites' },
        ];
        this.lineChartLabels = keys
      }
    })

    this.dashboardService.usersByAge().subscribe(data => {
      if (data) {
        this.pieChartLabels = ['<30', '30-40', '40-45', '45-50', '50-55', '>55'];
        this.pieChartData = [data.a30, data.a3040, data.a4045, data.a4550, data.a5055, data.a55];
      }
    })

    this.dashboardService.usersByAgeByGender().subscribe(data => {
      if (data) {
        this.barChartLabels2 = ['<30', '30-40', '40-45', '45-50', '50-55', '>55']
        this.barChartData2 = [
          { data: [data.male.a30, data.male.a3040, data.male.a4045, data.male.a4550, data.male.a5055, data.male.a55], label: 'Homme' },
          { data: [data.female.a30, data.female.a3040, data.female.a4045, data.female.a4550, data.female.a5055, data.female.a55], label: 'Femme' },
          { data: [data.other.a30, data.other.a3040, data.other.a4045, data.other.a4550, data.other.a5055, data.other.a55], label: 'Autre' },
        ];
      }
    })
  }

  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

}
