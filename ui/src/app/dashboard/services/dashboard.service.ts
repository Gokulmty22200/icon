import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = environment.apiUrl;

  constructor(private httpService: HttpClient) { }

  getHeaders(): HttpHeaders {
    const currentUserData = localStorage.getItem('currentUser');
    const currentUser = currentUserData ? JSON.parse(currentUserData) : null;
    const token = currentUser ? currentUser.token : null;
    const headers = new HttpHeaders();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getDashboardCardsData(timelineData, isEmpty): Observable<any[]> {
    let inputParams;
    let scanInputParams;
    if(!isEmpty){
      inputParams = {'month':timelineData.month, 'year':timelineData.year};
      scanInputParams = {'month':timelineData.month, 'year':timelineData.year,'scan_type':'Abdomen'};
    }
    else {
      inputParams = {};
      scanInputParams = {};
    }
    const headers = new HttpHeaders();
    // Make multiple API calls here
    const apiCall1 = this.httpService.post(this.apiUrl + `/get-total-scan-count`, inputParams, {headers});
    const apiCall2 = this.httpService.post(this.apiUrl + `/get-avg-scan-time`, scanInputParams, {headers});
    const apiCall3 = this.httpService.post(this.apiUrl + `/get-total-error-count`, inputParams, {headers});
    return forkJoin([apiCall1, apiCall2, apiCall3]);
  }

  getMonthErrorCount(){
    const headers = new HttpHeaders();
    return this.httpService.get(this.apiUrl + `/get-month-wise-error-count`, {headers});
  }

  getDashboardReportsData(timelineData, isEmpty): Observable<any[]> {
    let inputParams;
    if(!isEmpty){
      inputParams = {'month':timelineData.month, 'year':timelineData.year};
    }
    else {
      inputParams = {};
    }
    const headers = new HttpHeaders();
    // Make multiple API calls here
    const apiCall1 = this.httpService.post(this.apiUrl + `/get-code-wise-error-count`, inputParams, {headers});
    const apiCall2 = this.httpService.post(this.apiUrl + `/get-avg-snr`, inputParams, {headers});
    const apiCall3 = this.httpService.post(this.apiUrl + `/get-top-scan-data`, inputParams, {headers});
    return forkJoin([apiCall1,apiCall2,apiCall3]);
  }

  getAverageScanTime(scanType, timeData){
    let inputParams;
    let scanInputParams;
    if(timeData.month){
      scanInputParams = {'month':timeData.month, 'year':timeData.year,'scan_type':scanType};
    }else {
      scanInputParams = {'month':'12', 'year':'2023','scan_type':scanType};
    }
    const headers = new HttpHeaders();
    return this.httpService.post(this.apiUrl + `/get-avg-scan-time`, scanInputParams, {headers});
  }

   testAPI() {
    const headers = new HttpHeaders();
    const apiCall2 = this.httpService.post(this.apiUrl + `/get-top-scan-data`, {'month':'07','year':'2023'}, {headers});
    // Make multiple API calls here
    // const apiCall2 = this.httpService.get(this.apiUrl + `/get-month-wise-error-count`, {headers});
    return apiCall2;
  }

}
