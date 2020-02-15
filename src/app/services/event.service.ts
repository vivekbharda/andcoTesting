import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../config'

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private http: HttpClient
  ) { }



  /**
   * @param {Object} body 
   * @param {Object} files 
   * @param {Object} themeFiles
   * Create new event
   */
  addEvent(body, files: any) {
    console.log("event detailsssssss", body);
    console.log("filessssss name ", files);
    let formdata = new FormData();
    formdata.append('eventTitle', body.eventTitle);
    formdata.append('eventType', body.eventType);
    formdata.append('hashTag', body.hashTag);
    formdata.append('background', body.background)
    if (files.length) {
      for (let i = 0; i < files.length; i++) {
        formdata.append("profile", files[i]);
      }
    }
    return this.http.post(config.baseApiUrl + "/event", formdata);
  }

}
