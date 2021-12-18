import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

const headers = new HttpHeaders().set(
  "X-Token",
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJqaXJrYSIsImlhdCI6MTU2MzI1MzQyMCwiZXhwIjoyNTQxNDc0MjIwLCJhdWQiOiJwb3J0YWxqc2lyYSIsInN1YiI6InVzZXJqc2lyYXMiLCJHaXZlbk5hbWUiOiJKb2hubnkiLCJTdXJuYW1lIjoiUm9ja2V0IiwiRW1haWwiOiJqcm9ja2V0QGV4YW1wbGUuY29tIiwiUm9sZSI6WyJNYW5hZ2VyIiwiUHJvamVjdCBBZG1pbmlzdHJhdG9yIl19.b5hHxud28FhCqWSKK3Wu5FDZO4jUDQxV2qRd5wk3OAw"
);

@Injectable()
export class DataHomeService {
  private server = environment.API_URL;
  public server_rate: string = environment.API_URL_RATE;
  public params: any;

  constructor(private _http: HttpClient) {
    this.params = new HttpParams();
    this.params.append("size", String(4));
  }

  imageCarrusel(id, params: HttpParams = this.params): Observable<any> {
    return this._http.get(
      this.server +
        "/public/hotelphotos/gallery/ordered/" +
        id +
        "?" +
        params.toString(),
      { headers: headers }
    );
  }

  imageGallery(id, params: HttpParams = this.params): Observable<any> {
    return this._http.get(
      this.server +
        "/public/hotelphotos/gallery/" +
        id +
        "?" +
        params.toString(),
      { headers: headers }
    );
  }

  informationCustomizedService(id,params: HttpParams): Observable<any> {
    return this._http.get(this.server + "/public/customized-services/" + id + "?" + params.toString(), {
      headers: headers,
    });
  }

  informationHotelCarrusel(id): Observable<any> {
    return this._http.get(this.server + "/public/hotels/" + id, {
      headers: headers,
    });
  }

  getBySlug(token) {
    return this._http.get(this.server + "/public/hotels/slug/" + token, {
      headers: headers,
    });
  }

  informationOurRooms(id): Observable<any> {
    return this._http.get(
      this.server_rate + "/public/roomtypes-prices?affiliateIdSpec=" + id,
      { headers: headers }
    );
  }

  informationOurRoomsHome(id): Observable<any> {
    return this._http.get(
      this.server_rate +
        "/public/roomtypes-prices/api-home?affiliateIdSpec=" +
        id,
      { headers: headers }
    );
  }

  informationOurRoom(id): Observable<any> {
    return this._http.get(
      this.server_rate + "/public/roomtypes-prices/api-home/" + id,
      { headers: headers }
    );
  }

  informationBestPlaces(id): Observable<any> {
    return this._http.get(
      this.server + "/public/destinations/destinations-places/" + id,
      { headers: headers }
    );
  }

  informationDestino(id): Observable<any> {
    return this._http.get(this.server + "/public/destinations/" + id, {
      headers: headers,
    });
  }

  aboutSectionCarousel(id): Observable<any> {
    return this._http.get(
      this.server + "/public/about-affiliates?affiliateIdSpec=" + id,
      { headers: headers }
    );
  }

  dataOffers(): Observable<any> {
    return this._http.get(this.server + "/public/countries?showRows=2000", {
      headers: headers,
    });
  }

  getCertificationsHotel(params: HttpParams) {
    return this._http.get(
      this.server + "/public/certification-hotels" + "?" + params.toString(),
      { headers: headers }
    );
  }

  getPromotionsHotel(params: HttpParams) {
    return this._http.get(
      this.server_rate + "/public/promotions/by-date-range" + "?" + params.toString(),
      { headers: headers }
    );
  }

  getSeo(slug: string): Observable<any> {
    return this._http.get(this.server+'/public/hotels/seo/'+slug)
  }
}
