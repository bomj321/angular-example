import { ReservationService } from '../../services/reservation.service';
import { environment } from '../../../environments/environment';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { DataHomeService } from '../../services/data-home.service';
import { Lightbox } from 'ngx-lightbox';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { GeneralFunctionsService } from '../../services/general-functions.service'
import { isPlatformBrowser } from '@angular/common';
import { SEOService } from '../../services/seo.service';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-our-rooms-page',
  templateUrl: './our-rooms-page.component.html',
  styleUrls: ['./our-rooms-page.component.css'],
  providers: [ReservationService, DataHomeService]

})
export class OurRoomsPageComponent implements OnInit {

  /****************Variables for pagination********************/
  public Math: any;
  public pageSize: number;
  public page: number;

  /****************Variables for pagination********************/

  /**************Other variables****************/
  public server: string = environment.API_URL;
  public informationsOurRoomSection: any;
  public server_rate: string = environment.API_URL_RATE;
  public establismentInformation: any;
  public termsConditions: any;
  /**************Other variables****************/
  public galleryOptions: NgxGalleryOptions[];
  public loading: any;

  public check_in: string;
  public check_out: string;
  public roomSelected: any;
  public minDate: string;
  public maxDate: string;
  isBrowser: boolean;

  constructor(
    private _dataReservationService: ReservationService,
    private _dataService: DataHomeService,
    private router: Router,
    private route: ActivatedRoute,
    private _http: HttpClient,
    private generalFunctionsService: GeneralFunctionsService,
    private seoService: SEOService,
    private _lightbox: Lightbox, @Inject(PLATFORM_ID) private platformId)
  {
    this.isBrowser = isPlatformBrowser(this.platformId)
    this.Math = Math;
    this.pageSize = 5;
    this.page = 1;
  }

  ngOnInit() {
    this.seoService.updateTags({
      title: 'Nuestras habitaciones - Hotel Palermo Suite'
    })
    this.getUrlParameters();
    this.setDates(new Date(), new Date());


    this.galleryOptions = [

      {
        thumbnails: false,
        imageAnimation: NgxGalleryAnimation.Slide,
        imageAutoPlay: true,
        imageAutoPlayInterval: 10000
      },

      {
        thumbnails: false,
        breakpoint: 1800,
        width: '28rem',
        height: '250px'
      },

      // max-width 800
      {
        thumbnails: false,
        breakpoint: 991,
        width: '100%',
        height: '200px'
      },
      // max-width 400

      {
        thumbnails: false,
        breakpoint: 400,
        width: '100%',
        height: '150px',
        preview: false
      }
    ];

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

        if (response['code'] == "NOFD_RECORD") {
          this.router.navigate(['/hotel/not-found']);
        } else {
          this.establismentInformation = response;
          this.seoService.updateTags({
            title: 'Nuestras habitaciones - ' + this.establismentInformation.name,
            description: this.establismentInformation.summary,
            image: this.establismentInformation.urlImage,
            url: this.seoService.getBaseUrl() + '/' + slug,
          })
          this.informationOurRooms();
          this.getTermsConditions();
        }

      },
      error => {
        this.router.navigate(['/hotel/not-found']);
        console.log(<any>error);
        this.loading = false;

      }
    );
  }

  public informationOurRooms() {

    this.loading = true;
    this._dataService.informationOurRoomsHome(this.establismentInformation.id).subscribe(
      response => {

        if(response.filter(response => response.pricePerNight != null).length > 0)
        {
          this.informationsOurRoomSection = [];
          response.filter(response => response.pricePerNight != null).forEach(room => {
            this.informationOurRoomData(room, response.filter(response => response.pricePerNight != null).length);
          });
        }else
        {
          this.informationsOurRoomSection = [];
          this.loading = false;
        }

     

      },
      error => {
        console.log(<any>error);
        this.loading = false;


      }
    );
  }


  public informationOurRoomData(roomData, response) {
    this.loading = true;

    this._dataService.informationOurRoom(roomData.roomTypeHome.id).subscribe(
      roomDetail => {


        var arrayPhotoRoom = roomDetail.roomTypeDetail.images;
        var arrayPhotoDetail = [];
        
        if (roomData.roomTypeHome.urlImage) {
          arrayPhotoDetail.push(
            {
              small: this.server + roomData.roomTypeHome.urlImage,
              medium: this.server + roomData.roomTypeHome.urlImage,
              big: this.server + roomData.roomTypeHome.urlImage

            }
          )
        }


        arrayPhotoRoom.forEach(image => {
          arrayPhotoDetail.push({

            small: this.server + image.urlImage,
            medium: this.server + image.urlImage,
            big: this.server + image.urlImage
          });
        });

        this.informationsOurRoomSection.push({
          roomData,
          images: arrayPhotoDetail

        });
        if (response == this.informationsOurRoomSection.length) {
          setTimeout(() => {
            this.setDatepickerDate();
            this.loading = false;
          }, 2000);
        }


      },

      error => {
        console.log(<any>error);
        this.loading = false;


      }
    );
  }


  /**************FUNCTIONS TO DATEPICKER********************* */

  setDates(minDate, maxDate) {
    this.minDate = this.generalFunctionsService.formatDateDatePicker(minDate, '/');
    this.maxDate = this.generalFunctionsService.formatDateDatePicker(maxDate.setDate(maxDate.getDate() + 365), '/');

  }

  setDatepickerDate() {
    if(!this.isBrowser) return
    $(() => {

      $('.btn-reservations').daterangepicker({
        "locale": {
          "format": "DD/MM/YYYY",
          "separator": " - ",
          "applyLabel": "Reservar",
          "cancelLabel": "Cancelar",

          "weekLabel": "S",
          "daysOfWeek": [
            "Do",
            "Lu",
            "Ma",
            "Mi",
            "Ju",
            "Vi",
            "Sa"
          ],
          "monthNames": [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre"
          ],
          "firstDay": 1,
         
        },
        "minDate": this.minDate,
        "drops": "up",
        startDate: this.check_in,
        endDate: this.check_out,
      });

      $('.btn-reservations').on('apply.daterangepicker', (ev, picker) => {
        this.onFormSubmit(picker.startDate.format('YYYY-MM-DD'), picker.endDate.format('YYYY-MM-DD'));

      });

    });

  }


  /****Reserve*** */

  setRoom(room) {
    this.roomSelected = room;
  }


  public onFormSubmit(startDate, endDate) {

    let params = new HttpParams();
    params = params.append('affiliateIdSpec', String(this.establismentInformation.id));
    params = params.append('arrivalDateSpec', String(startDate));
    params = params.append('departureDateSpec', String(endDate));
    params = params.append('roomTypesSpec', String(this.roomSelected.roomData.roomTypeHome.id));


    this.loading = true
    this._dataReservationService.dataRoomAvailableOurRooms(params).subscribe(
      response => {

        var capacityTotal = 0;
        if (response.length) {
          let i;
          for (i = 0; i < response.length; i++) {

            capacityTotal += response[i].capacity;

          }

          if (capacityTotal < 1) {

            this.generalFunctionsService.notifications(this.termsConditions ? this.termsConditions : 'Apreciado cliente no hay disponibilidad para la cantidad de personas que ha indicado, por favor seleccione otras fechas', 'error');
            this.loading = false;

          } else {

            this.router.navigate([this.establismentInformation.token + '/our-rooms-disponibility', startDate, endDate, '1', 'ninguno', this.roomSelected.roomData.roomTypeHome.id]);
            this.loading = false;
          }

        } else {
          this.generalFunctionsService.notifications(this.termsConditions ? this.termsConditions : 'Apreciado cliente no hay disponiblidad en las fechas seleccionadas', 'error');
          this.loading = false

        }

      },
      error => {


        if (error.error.message.indexOf("Base rate not found") != -1) {
          this.generalFunctionsService.notifications('No hay tarifas registradas para este año', 'error');

        } else {
          this.generalFunctionsService.notifications('Ha ocurrido un error, por favor contacte con el administrador', 'error');

        }
        this.loading = false;

        console.log(<any>error);

      }
    );

  }

  /****************TERMS & CONDITIONS *******************/


  getTermsConditions() {

    let params = new HttpParams();
    params = params.append('affiliateIdSpec', String(this.establismentInformation.id));
    this._dataReservationService.getTermsConditions(params).subscribe((termsConditions: any) => {


      if (termsConditions.content[0] && termsConditions.content[0].noAvailabilityOnline) {
        this.termsConditions = this.generalFunctionsService.removeTags(termsConditions.content[0].noAvailabilityOnline);
      } else {
        this.termsConditions = null;
      }

    },
      error => {
        this.generalFunctionsService.notifications('Ha ocurrido un error al obtener los términos y condiciones, por favor contacte con el administrador', 'error');
      })
  }

  openLink(link)
  {

    if(link && link.split('//')[1] != '' && link.split('//')[1] != undefined && link.split('//')[1] != null)
    {
      if(this.isBrowser)
      window.open(link, '_blank');  
    }
  }

}



