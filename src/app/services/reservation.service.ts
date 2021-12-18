import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

const headers = new HttpHeaders().set('X-Token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJqaXJrYSIsImlhdCI6MTU2MzI1MzQyMCwiZXhwIjoyNTQxNDc0MjIwLCJhdWQiOiJwb3J0YWxqc2lyYSIsInN1YiI6InVzZXJqc2lyYXMiLCJHaXZlbk5hbWUiOiJKb2hubnkiLCJTdXJuYW1lIjoiUm9ja2V0IiwiRW1haWwiOiJqcm9ja2V0QGV4YW1wbGUuY29tIiwiUm9sZSI6WyJNYW5hZ2VyIiwiUHJvamVjdCBBZG1pbmlzdHJhdG9yIl19.b5hHxud28FhCqWSKK3Wu5FDZO4jUDQxV2qRd5wk3OAw');

@Injectable()
export class ReservationService {

  private server = environment.API_URL;
  public server_rate: string = environment.API_URL_RATE;


  constructor(
    private _http: HttpClient

  ) { }


  dataCalendar(actualMonth): Observable<any> {

    return this._http.get(this.server + '/public/rackcalendar/roomtype?year=2019&month=' + actualMonth + '&affiliateId=64', { headers: headers });

  }

  dataCountries(): Observable<any> {
    return this._http.get(this.server + '/public/countries?showRows=2000', { headers: headers });
  }

  dataDepartaments(params: HttpParams): Observable<any> {


    return this._http.get(this.server + '/public/departaments' + '?' + params.toString(), { headers: headers });

  }

  dataMunicipalities(params: HttpParams): Observable<any> {

    return this._http.get(this.server + '/public/municipalities' + '?' + params.toString(), { headers: headers });

  }

  dataRoomAvailable(id, routeCheckIn, routeCheckOut, routeRoomsTypeAvailables): Observable<any> {

    return this._http.get(this.server_rate + '/public/roomtypes-prices?affiliateIdSpec=' + id + '&arrivalDateSpec=' + routeCheckIn + '&departureDateSpec=' + routeCheckOut, { headers: headers });

  }


  dataRoomAvailableOurRooms(params: HttpParams): Observable<any> {

    return this._http.get(this.server_rate + '/public/roomtypes-prices' + '?' + params.toString(), { headers: headers });

  }

  reservationForm(dataCustom): Observable<any> {


    const params = dataCustom;
    return this._http.post(this.server + '/public/preservations/save', params, { headers: headers });
  }


  getTermsConditions(params: HttpParams): Observable<any> {
    return this._http.get(this.server + '/public/policy-terms' + '?' + params.toString(), { headers: headers });
  }




}
