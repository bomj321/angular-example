import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from 'rxjs';
import { DataHomeService } from '../../services/data-home.service';
import { SEOService } from '../../services/seo.service';
import { environment } from '../../../environments/environment';

declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [DataHomeService]
})
export class HomeComponent implements OnInit {

  public imageArrayCarrusel: any[] = [];
  public informationHotelCarrusel: any;
  public informationsOurRoomSection: any;
  public informationsMainServices: any;
  public roomsTypeAvailables: any;
  public establismentInformation:any;

  public loading:any;
  server: any = environment.API_URL;


  constructor(
    private _http: HttpClient,
    private _dataService: DataHomeService,
    private router: Router,
    private seoService: SEOService,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
    let data = this.route.snapshot.data.resolveData;
    this.seoService.updateTags({
      title: data.title,
      description: data.description,
      image: this.urlImg(data.urlImage),
      url: this.seoService.getBaseUrl() + '/' + data.token,
    })
    this.roomsTypeAvailables = [];
    this.imageArrayCarrusel = [];

    this.getUrlParameters();
  
  }


  getUrlParameters() {
   this.route.params.subscribe(params => {   
     this.informationHotelSlug(params['hotelSlug']);    
    });
  }


  public informationHotelSlug(slug) {

    this.loading = true;
    this._dataService.getBySlug(slug).subscribe(
      response => {

        if(response['code'] == "NOFD_RECORD")
        {
          this.router.navigate(['/hotel/not-found']);
        }else
        {
          this.establismentInformation = response;
          this.imageCarrusel();
          this.informationHotel();
          this.informationOurRoomsHome();
        }
        
      },
      error => {
        this.router.navigate(['/hotel/not-found']);
        console.log(<any>error);
        this.loading = false;

      }
    );
  }
  urlImg(url) {
    return this.server + url;
  }

  public informationHotel() {
    this.loading = true;

    this._dataService.informationHotelCarrusel(this.establismentInformation.id).subscribe(
      response => {

        this.informationHotelCarrusel = response;
        this.informationsMainServices = response.mainServices;
        this.loading = false;
      },
      error => {
        console.log(<any>error);
        this.loading = false;

      }
    );
  }

  public imageCarrusel() {
    this.loading = true;

    this._dataService.imageCarrusel(this.establismentInformation.id).subscribe(
      response => {
        this.imageArrayCarrusel = response;
         this.loading = false;

      },
      error => {
        console.log(<any>error);
         this.loading = false;

      }
    );
  }




  public informationOurRoomsHome() {

    this.loading = true;

    this._dataService.informationOurRoomsHome(this.establismentInformation.id).subscribe(
      response => {
        this.informationsOurRoomSection = response.filter(response => response.pricePerNight != null);
        let i;
        for (i = 0; i < this.informationsOurRoomSection.length; i++) {

          this.roomsTypeAvailables.push({
            nameTypeRoom: this.informationsOurRoomSection[i].name,
          });

        }
         this.loading = false;

      },
      error => {
        console.log(<any>error);
         this.loading = false;

      }
    );
  }

}
