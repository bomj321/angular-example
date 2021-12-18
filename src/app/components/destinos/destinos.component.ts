import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataHomeService } from '../../services/data-home.service';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-destinos',
  templateUrl: './destinos.component.html',
  styleUrls: ['./destinos.component.css'],
  providers: [DataHomeService]
})
export class DestinosComponent implements OnInit {

  public server: string = environment.API_URL;
  public bestDestinationsAvailables: any;

  /****************Variables for pagination********************/
  public pageSize: number;
  public page: number;

  /****************Variables for pagination********************/

  public establismentInformation: any;


  constructor(
    private _http: HttpClient,
    private _dataService: DataHomeService, private router: Router,
    private route: ActivatedRoute
  ) {
    this.pageSize = 2;
    this.page = 1;

  }

  ngOnInit() {
    this.getUrlParameters();
  }

  getUrlParameters() {
    this.route.params.subscribe(params => {
      this.informationHotelSlug(params['hotelSlug']);
    });
  }


  public informationHotelSlug(slug) {

    this._dataService.getBySlug(slug).subscribe(
      response => {

        if (response['code'] == "NOFD_RECORD") {
          this.router.navigate(['/hotel/not-found']);
        } else {
          this.establismentInformation = response;
          this.informationBestPlaces();

        }

      },
      error => {
        this.router.navigate(['/hotel/not-found']);
        console.log(<any>error);

      }
    );
  }


  public informationBestPlaces() {

    this._dataService.informationBestPlaces(this.establismentInformation.id).subscribe(
      response => {

        this.bestDestinationsAvailables = response.destinations;
        console.log(this.bestDestinationsAvailables);


      },
      error => {
        console.log(<any>error);

      }
    );
  }

}
