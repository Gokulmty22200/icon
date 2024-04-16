import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SharedService {
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

  getQaResponse(){
    const headers = new HttpHeaders();
    return this.httpService.get(this.apiUrl + `/get-qa-genai-response`, {headers});
  }

  uploadFile(formData: FormData) {
    const headers = new HttpHeaders();
    return this.httpService.post<any>(this.apiUrl + `/multiple-file-upload`, formData);
  }

  sendMessage(messageData: string) {
    const headers = new HttpHeaders();
    let inputParams = { 'question': messageData}
    return this.httpService.post<any>(this.apiUrl + `/get-chatbot-response`, inputParams, {headers});
  }

  getMRIPerformance(count: number) {
    const headers = new HttpHeaders();
    // let inputParams = { 'count': count}
    return this.httpService.get<any>(this.apiUrl + `/get-mri-performance-data?count=`+count);
  }

}
