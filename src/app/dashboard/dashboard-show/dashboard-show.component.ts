import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DashboardService } from '../dashboard-service/dashboard.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard-show',
  templateUrl: './dashboard-show.component.html',
  styleUrls: ['./dashboard-show.component.css']
})
export class DashboardShowComponent implements OnInit {

  constructor(
    public dashboardService: DashboardService,
    public Router: Router
  ) { }

  public placeId: any;
  public faSpinner = faSpinner;

  public carouselCards: any;
  public xAxisMonth: any;
  public xAxisWeek: any;
  public typeSeries: any;
  public qrSeries: any;
  public weekDaySeries: any;
  public storeSeries: any;
  public storeQrSeries: any;
  public storeWeekDaySeries: any;
  public infoSeries: any;
  public infoQrSeries: any;
  public infoWeekDaySeries: any;
  public categorySeries: any;
  public categoryQrSeries: any;
  public categoryWeekDaySeries: any;
  public useData: any[] = [];
  public useSeries: any[] = [];
  public timeRangeSeries: any[] = [];
  public sessionData = { os: {}, browser: {} }
  public sessionSeries: any;
  public useTime: any;
  public useTimeString: string | undefined;
  public useAmount = 0;
  public successfulQuestions = 0;
  public successfulQuestionsRate: any;
  public loading = false;
  public interactions: any = { type: [], qr: [], weekDay: [], timeRange: [], store: [], storeQr: [], storeWeekDay: [], info: [], infoQr: [], infoWeekDay: [], category: [], categoryQr: [], categoryWeekDay: [] };

  ngOnInit(): void {
    // const placeIdSaved = localStorage.getItem('CURRENT_PLACE');
    // if (!placeIdSaved) this.Router.navigate(['/place']);
    // else {
    //   this.placeId = parseInt(placeIdSaved);
    //   this.getAllData().then(() => {
    //     this.setAllData();
    //     this.loading = false;
    //   }).catch((err: any) => {
    //     console.log(err);
    //   });
    // }
  }

  async getAllData() {
    this.useData = await this.dashboardService.getInteractionsPerDay(this.placeId, {});
    await this.getInteractionsType({ place_id: this.placeId });
    await this.getInteractionsStore({ place_id: this.placeId });
    await this.getInteractionsInfo({ place_id: this.placeId });
    await this.getInteractionsCategory({ place_id: this.placeId });
    this.interactions.timeRange = await this.dashboardService.getInteractionsTimeRange(this.placeId, {});
    await this.getInteractionsSessions({ place_id: this.placeId });
    this.useTime = await this.dashboardService.getInteractionsUseTime(this.placeId, {});
    this.successfulQuestionsRate = await this.dashboardService.getSuccessfulQuestions(this.placeId, {});
  }

  async getInteractionsType(options: any) {
    const { interactionsQr, interactionsType, interactionsWeekDay } = await this.dashboardService.getInteractionsType(options);
    this.interactions.type = interactionsType;
    this.interactions.qr = interactionsQr;
    this.interactions.weekDay = interactionsWeekDay;
  }

  async getInteractionsStore(options: any) {
    const { interactionsStore, interactionsStoreQr, interactionsStoreWeekDay } = await this.dashboardService.getInteractionsStore(options);
    this.interactions.store = interactionsStore;
    this.interactions.storeQr = interactionsStoreQr;
    this.interactions.storeWeekDay = interactionsStoreWeekDay;
  }

  async getInteractionsInfo(options: any) {
    const { interactionsInfo, interactionsInfoQr, interactionsInfoWeekDay } = await this.dashboardService.getInteractionsInfo(options);
    this.interactions.info = interactionsInfo;
    this.interactions.infoQr = interactionsInfoQr;
    this.interactions.infoWeekDay = interactionsInfoWeekDay;
  }

  async getInteractionsCategory(options: any) {
    const { interactionsCategory, interactionsCategoryQr, interactionsCategoryWeekDay } = await this.dashboardService.getInteractionsCategory(options);
    this.interactions.category = interactionsCategory;
    this.interactions.categoryQr = interactionsCategoryQr;
    this.interactions.categoryWeekDay = interactionsCategoryWeekDay;
  }

  async getInteractionsSessions(options: any) {
    const { sessionsByOs, sessionsByBrowser } = await this.dashboardService.getInteractionsSessions(options);
    this.sessionData.os = sessionsByOs;
    this.sessionData.browser = sessionsByBrowser;
  }

  fillMonthMissingDates(data: any, month: any) {
    const arrayOfDays = Array.from(Array(moment(month).daysInMonth()).keys()).map(i => {
      if (String(i + 1).length === 1) return '0' + String(i + 1) + '/' + moment(month).format('MM/YYYY');
      else return String(i + 1) + '/' + moment(month).format('MM/YYYY');
    });
    const dataDates = data.reduce((dates: any, data: any) => {
      dates[moment(data.interaction_date).format('DD/MM/YYYY')] = data.value;
      return dates;
    }, {});
    return arrayOfDays.map((i: any) => {
      if (!Object.keys((dataDates)).includes(i)) return 0;
      return dataDates[i];
    });
  }

  fillWeekDayMissingDates(dataObject: any) {
    const filledData = this.xAxisWeek.reduce((output: any, day: any) => {
      const dayLowerCase = day.toLowerCase();
      output[dayLowerCase] = dataObject[dayLowerCase] ? dataObject[dayLowerCase] : {};
      return output;
    }, {});
    const eventNames = Array.from(new Set(Object.values(filledData).flatMap((event: any) => Object.keys(event))));
    const resultArray = eventNames.map(eventName => {
      const data = Object.values(filledData).map((event: any) => event[eventName] || 0);
      return { name: eventName, data: data };
    });
    return resultArray;
  }

  fillQrMissingData(dataArray: any) {
    const eventNames = Array.from(new Set(Object.values(dataArray).flatMap((event: any) => Object.keys(event))));
    const resultArray = eventNames.map(eventName => {
      const data = Object.values(dataArray).map((event: any) => event[eventName] || 0);
      return { name: eventName, data: data };
    });
    return resultArray;
  }

  fillTimeRange(dates: any, month: any) {
    const arrayOfDays = Array.from(Array(moment(month).daysInMonth()).keys()).map(i => {
      if (String(i + 1).length === 1) return '0' + String(i + 1) + '/' + moment(month).format('MM/YYYY');
      else return String(i + 1) + '/' + moment(month).format('MM/YYYY');
    });
    const firstUse: any = [];
    const lastUse: any = [];
    const datesParsed = Object.keys(dates);
    arrayOfDays.forEach((i: any) => {
      if (datesParsed.includes(i)) {
        firstUse.push(moment(dates[i].firstUse).format('HH'));
        lastUse.push(moment(dates[i].lastUse).format('HH'));
      }
      else {
        firstUse.push(0)
        lastUse.push(0)
      }
    });
    return { firstUse, lastUse };
  }

  translateEvent(event: string) {
    switch (event) {
      case 'map-show' || 'map-store-options' || 'map-store-list' || 'map-place-restroom' || 'map-place-exit' || 'map-open-category':
        return 'Mapa Interactivo';
      case 'store-show' || 'map-store-plot':
        return 'Ver Tienda';
      case 'store-index':
        return 'Lista de tiendas';
      case 'info-show':
        return 'Ver Información';
      case 'info-index':
        return 'Lista de informaciones';
    } return 'Otro';
  }

  translateTypeSeries(data: any) {
    const events = Object.keys(data);
    const translatedEvents = events.reduce((output: any, event: string) => {
      if (event !== 'close') output[this.translateEvent(event)] = data[event];
      return output;
    }, {});
    return translatedEvents;
  }

  setAllData() {
    this.setXAxis();
    this.setUses();
    this.setRegularSeries();
    this.setQrSeries()
    this.setWeekDaySeries();
    this.setSessionSeries();
    this.setTimeRangeSeries();
    this.setUseTime();
    this.setCarousel();
  }

  setXAxis() {
    const month = moment().daysInMonth();
    this.xAxisMonth = {
      categories: Array.from(Array(month).keys()).map(i => {
        return moment().startOf('month').add(i, 'days').locale('es').format('DD/MM');
      }),
      tickAmount: 15
    };
    this.xAxisWeek = Array.from(Array(7).keys()).map(i => moment().day(i).locale('es').format('dddd'));
  }

  setUses() {
    this.useSeries = [{
      name: 'Usos', data: this.fillMonthMissingDates(this.useData, moment())
    }];
    this.useAmount = this.useData.reduce((total: any, data: any) => total + parseInt(data.value, 10), 0);
    this.successfulQuestions = this.interactions.type['map-show'] + this.interactions.type['store-show'] + this.interactions.type['info-show']
    this.successfulQuestionsRate = Math.round(((this.successfulQuestionsRate.length / this.useAmount) * 100));
  }

  setRegularSeries() {
    const interactionsType = this.translateTypeSeries(this.interactions.type);
    this.typeSeries = {
      series: Object.values(interactionsType),
      labels: Object.keys(interactionsType)
    };
    this.storeSeries = {
      series: Object.values(this.interactions.store),
      labels: Object.keys(this.interactions.store)
    };
    this.infoSeries = {
      series: Object.values(this.interactions.info),
      labels: Object.keys(this.interactions.info)
    };
    this.categorySeries = {
      series: Object.values(this.interactions.category),
      labels: Object.keys(this.interactions.category)
    };
  }

  setQrSeries() {
    Object.keys(this.interactions.qr).map((i: string) => {
      this.interactions.qr[i] = this.translateTypeSeries(this.interactions.qr[i]);
    });
    this.qrSeries = {
      xAxis: Object.keys(this.interactions.qr),
      series: this.fillQrMissingData(this.interactions.qr)
    };
    this.storeQrSeries = {
      xAxis: Object.keys(this.interactions.storeQr),
      series: this.fillQrMissingData(this.interactions.storeQr)
    };
    this.infoQrSeries = {
      xAxis: Object.keys(this.interactions.infoQr),
      series: this.fillQrMissingData(this.interactions.infoQr)
    };
    this.categoryQrSeries = {
      xAxis: Object.keys(this.interactions.categoryQr),
      series: this.fillQrMissingData(this.interactions.categoryQr)
    };
  }

  setWeekDaySeries() {
    Object.keys(this.interactions.weekDay).map((i: string) => {
      this.interactions.weekDay[i] = this.translateTypeSeries(this.interactions.weekDay[i]);
    });
    this.weekDaySeries = {
      series: this.fillWeekDayMissingDates(this.interactions.weekDay),
      xAxis: this.xAxisWeek
    };
    this.storeWeekDaySeries = {
      series: this.fillWeekDayMissingDates(this.interactions.storeWeekDay),
      xAxis: this.xAxisWeek
    };
    this.infoWeekDaySeries = {
      series: this.fillWeekDayMissingDates(this.interactions.infoWeekDay),
      xAxis: this.xAxisWeek
    };
    this.categoryWeekDaySeries = {
      series: this.fillWeekDayMissingDates(this.interactions.categoryWeekDay),
      xAxis: this.xAxisWeek
    };
  }

  setSessionSeries() {
    this.sessionSeries = {
      os: {
        series: Object.values(this.sessionData.os),
        labels: Object.keys(this.sessionData.os)
      }, browser: {
        series: Object.values(this.sessionData.browser),
        labels: Object.keys(this.sessionData.browser)
      }
    };
  }

  setTimeRangeSeries() {
    const { firstUse, lastUse } = this.fillTimeRange(this.interactions.timeRange.dates, moment());
    this.timeRangeSeries = [
      {
        name: 'Primer Uso',
        data: firstUse
      },
      {
        name: 'Último Uso',
        data: lastUse
      }
    ];
  }

  setUseTime() {
    const translateTime: any = {
      minutes: 'Minutos',
      hours: 'Horas',
      days: 'Días',
      months: 'Meses',
      years: 'Años'
    };
    Object.keys(this.useTime[0]).forEach((key: any) => {
      if (this.useTime[0][key] !== '0') {
        this.useTime[0][translateTime[key]] = this.useTime[0][key];
      }
      delete this.useTime[0][key];
    });
    const time = Object.keys(this.useTime[0]).reduce((output: any, key: any) => {
      if (this.useTime[0][key] !== 0) output += this.useTime[0][key] + ' ' + key + ', ';
      return output;
    }, '');
    this.useTimeString = time.slice(0, -2);
  }

  setCarousel() {
    this.carouselCards = [
      {
        title: 'Tiendas',
        state: true,
        series: this.storeSeries.series,
        labels: this.storeSeries.labels,
      },
      {
        title: 'Informaciones',
        state: false,
        series: this.infoSeries.series,
        labels: this.infoSeries.labels,
      },
      {
        title: 'Categorías',
        state: false,
        series: this.categorySeries.series,
        labels: this.categorySeries.labels,
      },
    ]
  }


}
