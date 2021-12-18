import { environment } from "../../../environments/environment";
import { Component, Inject, OnInit, PLATFORM_ID } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient, HttpParams } from "@angular/common/http";
import { DataHomeService } from "../../services/data-home.service";
import { Lightbox } from "ngx-lightbox";
import { GeneralFunctionsService } from '../../services/general-functions.service'
import { ReservationService } from '../../services/reservation.service';
import { PromotionModalComponent } from '../../modales/promotion-modal/promotion-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { isPlatformBrowser } from '@angular/common';
import { SEOService } from '../../services/seo.service';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: "app-promotions-page",
  templateUrl: "./promotions-page.component.html",
  styleUrls: ["./promotions-page.component.scss"],
  providers: [ReservationService]
})
export class PromotionsPageComponent implements OnInit {
  /****************Variables for pagination********************/
  public pageSize: number;
  public page: number;

  /****************Variables for pagination********************/

  /**************Other variables****************/
  public server: string = environment.API_URL;
  public serverRate: string = environment.API_URL_RATE;

  public informationsOurRoomSection: any;
  public informationOurOffers: any;
  public promotions: any;
  public promotionsPageable: any = [];
  public establismentInformation: any;
  public loading: any = true;
  public termsConditions: any;

  /********Variables to datepicker******** */
  public check_in: string;
  public check_out: string;
  public agreementSelected: any;
  public minDate: string;
  public maxDate: string;
  isBrowser: boolean;

  constructor(
    private _dataService: DataHomeService,
    private router: Router,
    private modal: NgbModal,
    private route: ActivatedRoute,
    private _http: HttpClient,
    private generalFunctionsService: GeneralFunctionsService,
    private _dataReservationService: ReservationService,
    private seoService: SEOService,
    private _lightbox: Lightbox, @Inject(PLATFORM_ID) private platformId)
  {
    this.isBrowser = isPlatformBrowser(this.platformId)
    this.pageSize = 5;
    this.page = 1;
  }

  ngOnInit() {
    this._dataService.getSeo('palermos').subscribe((resp: any) => {
      this.seoService.updateTags({
        title: 'Promociones ' + resp.title,
        description: resp.description,
        image: 'https://www.cotelco.org:9090/jpms-gateway/ms-jpms'+resp.urlImage,
        url: this.seoService.getBaseUrl() + '/' + resp.token,
      })
    })

    this.getUrlParameters();
    this.setDates(new Date(), new Date());
    
  }



  getUrlParameters() {
    this.route.params.subscribe((params) => {
      this.informationServiceSlug(params["hotelSlug"]);
    });
  }

  public informationServiceSlug(slug) {
    this._dataService.getBySlug(slug).subscribe(
      (response) => {
        if (response["code"] == "NOFD_RECORD") {
          this.router.navigate(["/hotel/not-found"]);
        } else {
          this.establismentInformation = response;
          // this.seoService.updateTags({
          //   title: 'Promociones - ' + this.establismentInformation.name,
          //   description: this.establismentInformation.summary,
          //   image: this.establismentInformation.urlImage,
          //   url: this.seoService.getBaseUrl() + '/' + slug,
          // })
          this.getPromotions();
          this.getTermsConditions();
        }

      },
      (error) => {
        this.router.navigate(["/hotel/not-found"]);
        console.log(<any>error);
        this.loading = false;
      }
    );
  }


  public getPromotions() {

    var startDate = new Date()
    var finishDate = new Date()
    finishDate.setMonth(finishDate.getMonth() + 6)

    let params = new HttpParams();
    params = params.append("startDateParam", String(startDate.getFullYear() + "-" + (this.generalFunctionsService.addZero(startDate.getMonth() + 1)) + "-" + this.generalFunctionsService.addZero(startDate.getDate())));
    params = params.append("finishDateParam", String(finishDate.getFullYear() + "-" + (this.generalFunctionsService.addZero(finishDate.getMonth() + 1)) + "-" + this.generalFunctionsService.addZero(finishDate.getDate())));
    params = params.append("affiliateIdParam", String(this.establismentInformation.id));
    this._dataService
      .getPromotionsHotel(params)
      .subscribe(
        (response: any[]) => {

          this.promotions = response;
          setTimeout(() => {
            this.setDatepickerDate();
            this.loading = false;
          }, 2000);


        },
        (error) => {
          console.log(<any>error);
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
        "drops": "up",
        "minDate": this.minDate,
        //"maxDate": this.maxDate,
        startDate: this.check_in,
        endDate: this.check_out,
      });

      $('.btn-reservations').on('apply.daterangepicker', (ev, picker) => {
        this.onFormSubmit(picker.startDate.format('YYYY-MM-DD'), picker.endDate.format('YYYY-MM-DD'));

      });

    });

  }

  setAgreement(agreement) {
    this.agreementSelected = agreement;
  }


  public onFormSubmit(startDate, endDate) {


    var dateEndPicker = new Date(endDate).getTime();
    var dateEndAgreement = new Date(this.agreementSelected.agreement.finishDate).getTime();
    if (dateEndAgreement < dateEndPicker) {
      this.generalFunctionsService.notifications('Las fechas seleccionadas están fueras del rango de la promoción', 'error');
      return false;
    }

    let params = new HttpParams();
    params = params.append('affiliateIdSpec', String(this.establismentInformation.id));
    params = params.append('arrivalDateSpec', String(startDate));
    params = params.append('departureDateSpec', String(endDate));

    var estados = ''
    for (let i = 0; i < this.agreementSelected.roomTypes.length; i++) {

      params = params.append('roomTypesSpec', String(this.agreementSelected.roomTypes[i]));


      if (this.agreementSelected.roomTypes[i]) {
        estados += String(this.agreementSelected.roomTypes[i]) + ((i + 1) == this.agreementSelected.roomTypes.length ? '' : ',')
      }

    }


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

            this.router.navigate([this.establismentInformation.token + '/our-rooms-disponibility', startDate, endDate, "1", this.agreementSelected.agreement.code ? this.agreementSelected.agreement.code : 'ninguno', estados]);
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
       
  
        if(termsConditions.content[0] && termsConditions.content[0].noAvailabilityOnline)
        {
          this.termsConditions = this.generalFunctionsService.removeTags(termsConditions.content[0].noAvailabilityOnline);
        }else
        {
          this.termsConditions = null;
        }  
        
      },
        error => {
          this.generalFunctionsService.notifications('Ha ocurrido un error al obtener los términos y condiciones, por favor contacte con el administrador', 'error');
        })
    }



    
  openModalPromotion(promotion) {
    const modal = this.modal.open(PromotionModalComponent, { size: 'lg', backdrop: 'static' });
    modal.componentInstance.promotion = promotion;
 
  }


  getUrl(url)
  {

    if (url.indexOf("/public") != -1) {
      return this.server + url;
    } else {
      return url;
    }    
  }


  getUrlRate(url)
  {

    if (url.indexOf("/public") != -1) {
      return this.serverRate + url;
    } else {
      return url;
    }    
  }


}
