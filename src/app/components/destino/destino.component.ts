import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
import { DataHomeService } from '../../services/data-home.service';
import { environment } from '../../../environments/environment';
// import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlaceModalComponent } from '../../modales/place-modal/place-modal.component';
import { OwlOptions } from 'ngx-owl-carousel-o';

declare var jQuery: any;
declare var $: any;


@Component({
  selector: 'app-destino',
  templateUrl: './destino.component.html',
  styleUrls: ['./destino.component.css'],
  // providers: [{
    // provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  // }]
})
export class DestinoComponent implements OnInit {
  public server: string = environment.API_URL;
  public informationSocialNetworks: any;
  public informationDestinoData
  public idDestinyParam: any;
  public pageRoute: any;
  public establismentInformation: any;
  public galleryOptions: NgxGalleryOptions[];
  public galleryImages: NgxGalleryImage[];
  private subRoute: any;
  public loading: any = true;

  public customOptions: OwlOptions = {
    autoplay: true,
    nav: true,
    dots: true,
    loop: true,
    navSpeed: 700,
    items: 3,
    navText: [`<i class='fa fa-chevron-circle-left fa-chevron-hover' aria-hidden='true'></i>`, `<i class='fa fa-chevron-circle-right fa-chevron-hover' aria-hidden='true'></i>`]
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _http: HttpClient,
    private _dataService: DataHomeService,
    private modal: NgbModal

  ) { }

  ngOnInit() {

    this.subRoute = this.route.params.subscribe(params => {
      this.idDestinyParam = params['idDestino'];
      this.pageRoute = params['name'];
      this.informationHotelSlug(params['hotelSlug']);
    });

    this.galleryOptions = [
      {
        "thumbnails": false,
        imageAnimation: NgxGalleryAnimation.Slide
      },

      // max-width 1800
      {
        breakpoint: 2500,
        width: '100%',
        height: '600px'

      },

      // max-width 1800
      {
        breakpoint: 1800,
        width: '100%',
        height: '500px'
      },
      // max-width 800
      {
        breakpoint: 800,
        width: '100%',
        height: '500px'
      },
      // max-width 400
      {
        breakpoint: 400,
        width: '100%',
        height: '200px'
      },
    ];


  }

  public informationHotelSlug(slug) {

    this._dataService.getBySlug(slug).subscribe(
      response => {

        if (response['code'] == "NOFD_RECORD") {
          this.router.navigate(['/hotel/not-found']);
          this.loading = false
        } else {
          this.establismentInformation = response;
          this.informationDestinoDataRequest(this.idDestinyParam);
          this.informationHotelNetworks();
        }

      },
      error => {
        this.router.navigate(['/hotel/not-found']);
        this.loading = false
        console.log(<any>error);

      }
    );
  }

  public informationHotelNetworks() {

    this._dataService.informationHotelCarrusel(this.establismentInformation.id).subscribe(
      response => {

        this.informationSocialNetworks = response.socialNetworks;
      },
      error => {
        console.log(<any>error);
        this.loading = false

      }
    );
  }


  public informationDestinoDataRequest(idDestinyParam) {

    this._dataService.informationDestino(idDestinyParam).subscribe(
      response => {


        this.informationDestinoData = response;
        console.log(response);
        this.galleryImages = [];
        if (this.informationDestinoData.urlImage) {
          this.galleryImages.push(
            {
              small: this.server + this.informationDestinoData.urlImage,
              medium: this.server + this.informationDestinoData.urlImage,
              big: this.server + this.informationDestinoData.urlImage

            }
          )
        }

        this.loading = false

      },
      error => {
        console.log(<any>error);
        this.loading = false

      }
    );
  }

  openModalPlace(place) {
    const modal = this.modal.open(PlaceModalComponent);
    modal.componentInstance.title = place.name;
    modal.componentInstance.place = place;
  }




}
