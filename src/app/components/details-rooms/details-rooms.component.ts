import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
import { DataHomeService } from '../../services/data-home.service';
import { environment } from '../../../environments/environment';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { GeneralFunctionsService } from '../../services/general-functions.service'
import { ReservationService } from '../../services/reservation.service';
import { isPlatformBrowser } from '@angular/common';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-details-rooms',
  templateUrl: './details-rooms.component.html',
  styleUrls: ['./details-rooms.component.css'],
  providers: [ReservationService, DataHomeService]

})
export class DetailsRoomsComponent implements OnInit {

  public Math: any;
  public server: string = environment.API_URL;
  public server_rate: string = environment.API_URL_RATE;

  public informationOurRoom: any;
  public idRoomRoute: any;
  public pageRoute: any;
  private subRoute: any;
  public galleryOptions: NgxGalleryOptions[];
  public galleryImages: NgxGalleryImage[];
  public establismentInformation: any;
  public informationHotelCarrusel: any;
  public loading: any = true;
  public messageTooltip: any;
  public check_in: any;
  public check_out: any;
  public roomSelected: any;
  public termsConditions: any;
  public minDate: string;
  public maxDate: string;

  public customOptions: OwlOptions = {
    autoplay: true,
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 100,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: true
  }
  isBrowser: boolean;



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _http: HttpClient,
    private _dataService: DataHomeService,
    private generalFunctionsService: GeneralFunctionsService,
    private _dataReservationService: ReservationService, @Inject(PLATFORM_ID) private platformId) {
      this.isBrowser = isPlatformBrowser(this.platformId)
      this.Math = Math;
    }

  ngOnInit() {
    this.subRoute = this.route.params.subscribe(params => {
      this.idRoomRoute = params['idRoom'];
      this.pageRoute = params['name'];
      this.informationHotelSlug(params['hotelSlug']);
    });



    this.galleryOptions = [
      {
        width: '100%',
        height: '400px',
        thumbnails: false,
        imageAnimation: NgxGalleryAnimation.Slide
      },
      // max-width 800
      {
        breakpoint: 800,
        width: '100%',
        height: '300px'

      },
      // max-width 400
      {
        breakpoint: 400,
        height: '200px'
      }
    ];

    if(this.isBrowser)
      this.setDates(new Date(), new Date());



  }

  public informationHotelSlug(slug) {

    this._dataService.getBySlug(slug).subscribe(
      response => {

        if (response['code'] == "NOFD_RECORD") {
          this.router.navigate(['/hotel/not-found']);
          this.loading = false;
        } else {
          this.establismentInformation = response;
          if (this.establismentInformation.iva == 0 || !this.establismentInformation.iva) {
            this.messageTooltip = 'Para este servicio no aplica el cargo de impuestos';
          } else {
            this.messageTooltip = 'Los ciudadanos de Colombia deberán abonar un ' + this.establismentInformation.iva + '% de IVA. Este impuesto no está incluido en el precio final.';
          }
          this.informationOurRoomData(this.idRoomRoute)
          this.informationHotel();
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

  public informationHotel() {

    this.loading = true;
    this._dataService.informationHotelCarrusel(this.establismentInformation.id).subscribe(
      response => {
        this.informationHotelCarrusel = response;
        this.loading = false;
      },
      error => {
        console.log(<any>error);
        this.loading = false;

      }
    );
  }



  public informationOurRoomData(idRoomRoute) {

    this.loading = true;
    this._dataService.informationOurRoom(idRoomRoute).subscribe(
      response => {
        console.log(response);
        this.informationOurRoom = response;

        this.galleryImages = [];
        if (this.informationOurRoom.roomTypeDetail.roomType.urlImage) {
          this.galleryImages.push(
            {
              small: this.server + this.informationOurRoom.roomTypeDetail.roomType.urlImage,
              medium: this.server + this.informationOurRoom.roomTypeDetail.roomType.urlImage,
              big: this.server + this.informationOurRoom.roomTypeDetail.roomType.urlImage

            }
          )
        }


        if (this.informationOurRoom.roomTypeDetail.images.length > 0) {
          this.informationOurRoom.roomTypeDetail.images.forEach(elementImages => {
            this.galleryImages.push(
              {
                small: this.server + elementImages.urlImage,
                medium: this.server + elementImages.urlImage,
                big: this.server + elementImages.urlImage

              }
            )

          });

        }
        setTimeout(() => {
          this.setDatepickerDate();
          this.loading = false;
        }, 2000);

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
          "firstDay": 1
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
    params = params.append('roomTypesSpec', String(this.roomSelected.roomTypeDetail.roomType.affiliateId));


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

  openLink(link) {

    if (link && link.split('//')[1] != '' && link.split('//')[1] != undefined && link.split('//')[1] != null) {
      if(this.isBrowser)
      window.open(link, '_blank');
    }
  }

}
