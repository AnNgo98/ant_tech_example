import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { user } from './user.model';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { FormGroup } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class UserService {
readonly apiURL = 'https://app-dev.joynit.io/api/classes/FakeUser'
  formData : user

  constructor(private http: HttpClient) {
  }
  
  getUserList(){
    const myHeader = new HttpHeaders({'X-Parse-Application-Id': 'AT_LinpApp_Dev'});
    return this.http.get(this.apiURL, {headers: myHeader})
  } 

  editUser(data){
    const myHeader = new HttpHeaders({'X-Parse-Application-Id': 'AT_LinpApp_Dev'});
    return this.http.put(this.apiURL + '/'+ data.objectId,data, {headers: myHeader})
  }

  deleteUser(id){
    const myHeader = new HttpHeaders({'X-Parse-Application-Id': 'AT_LinpApp_Dev'});
    return this.http.delete(this.apiURL +'/'+ id, {headers: myHeader});
  }

  createUser(data: any){
    const myHeader = new HttpHeaders({'X-Parse-Application-Id': 'AT_LinpApp_Dev'});
    return this.http.post(this.apiURL , data, {headers: myHeader});
  }
}
