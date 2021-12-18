import { Component, OnInit, Input, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from "@angular/router";
import { GeneralFunctionsService } from '../../services/general-functions.service'
import { HttpParams } from '@angular/common/http';
import { DataHomeService } from "../../services/data-home.service";
import { isPlatformBrowser } from '@angular/common';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-bar-search',
  templateUrl: './bar-search.component.html',
  styleUrls: ['./bar-search.component.css'],
  providers: [ReservationService]
})
export class BarSearchComponent implements OnInit {

  @Input('roomTypeAvailable') roomTypeAvailable: any;
  @Input('promotionCode') promotionCode: any;
  @Input('numberGuests') numberGuests: any = 1;

  @Input() routeCheckIn: any;
  @Input() routeCheckOut: any;

  @Input() establismentInformation: any;
  public server: string = environment.API_URL;
  public server_rate: string = environment.API_URL_RATE;

  public routeNumberAdult: any;
  public routeNumberChildren: any;
  public bookingForm: FormGroup;
  public subRoute: any;
  public name: any;
  public termsConditions: any;
  public loading: any;

  /*******Date picker**** */
  public check_in: any;
  public check_out: any;


  public check_id_picker: any;
  public check_out_picker: any;
  isBrowser: boolean;


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _dataService: DataHomeService,
    private route: ActivatedRoute,
    private _dataReservationService: ReservationService,
    private generalFunctionsService: GeneralFunctionsService, @Inject(PLATFORM_ID) private platformId) {
      this.isBrowser = isPlatformBrowser(this.platformId)
    }



  ngOnInit() {
    if(!this.isBrowser) return
 
    this.initbookingForm();
    this.getTermsConditions();

    this.subRoute = this.route.params.subscribe(params => {
      this.routeNumberAdult = params['numberAdult'];
      this.routeNumberChildren = params['numberChildren'];
      this.routeCheckIn = params['newFormatCheckIn'];
      this.routeCheckOut = params['newFormatCheckOut'];

      this.setDates(this.routeCheckIn ? new Date(this.routeCheckIn).setDate(new Date(this.routeCheckIn).getDate() + 1) : new Date(), this.routeCheckOut ? new Date(this.routeCheckOut).setDate(new Date(this.routeCheckOut).getDate() + 1) : new Date().setDate(new Date().getDate() + 1));

    });

    setTimeout(() => {  
      this.setDatepickerDate();

    }, 2000);

  }

  setDates(checkIn, checkOut) {

    this.check_id_picker = this.generalFunctionsService.formatDateDatePicker(checkIn, '/');
    this.check_out_picker = this.generalFunctionsService.formatDateDatePicker(checkOut, '/');
    this.check_in = this.generalFunctionsService.formatDateForApi(checkIn, '-');
    this.check_out = this.generalFunctionsService.formatDateForApi(checkOut, '-');

  }



  initbookingForm() {
    this.bookingForm = this.formBuilder.group({
      checkIn: '',
      checkOut: '',
      adults: '',
      children: '',
    });
  }

  public addZero(i) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }



  setDatepickerDate() {
    if(!this.isBrowser) return
    $(() => {

      $('.datepicker').daterangepicker({
        "locale": {
          "format": "DD/MM/YYYY",
          "separator": " - ",
          "applyLabel": "Aplicar",
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
        startDate: this.check_id_picker,
        endDate: this.check_out_picker,
      });

      $('.datepicker').on('apply.daterangepicker', (ev, picker) => {


        this.check_in = picker.startDate.format('YYYY-MM-DD');
        this.check_out = picker.endDate.format('YYYY-MM-DD');
      });

    });

  }


  onFormSubmit($event) {
    $event.preventDefault()
    if (!this.check_in || this.check_in == '') {

      this.generalFunctionsService.notifications('Indica la fecha de entrada y salida para validar nuestra disponibilidad', 'error');
      /* this.router.navigate(['/reservations']);*/

      return false;
    }

    if (!this.check_out || this.check_out == '') {
      this.generalFunctionsService.notifications('Indica la fecha de entrada y salida para validar nuestra disponibilidad', 'error');
      /*this.router.navigate(['/reservations']);*/
      return false;
    }


    var numberAdult = $("#numberGuests").val() //Text of input numberChildren
    var promoCode = $("#promotionCode").val() //Text of input numberChildren

    var dateStart = new Date(this.check_in).getTime();
    var dateEnd = new Date(this.check_out).getTime();

    if (dateEnd < dateStart) {
      this.generalFunctionsService.notifications('La fecha de salida debe ser mayor a la de entrada, por favor verifica y vuelve a intentar', 'error');
      return false;
    }

    this.loading = true


    if (promoCode != '' && promoCode) {
      this.getPromotions(this.check_in, this.check_out, numberAdult, promoCode);
    } else {
      this.getRooms(this.check_in, this.check_out, numberAdult);
    }

  }



  getPromotions(startDate, finishDate, numberAdult, promoCode) {

    let params = new HttpParams();
    params = params.append("startDateParam", String(startDate));
    params = params.append("finishDateParam", String(finishDate));
    params = params.append("affiliateIdParam", String(this.establismentInformation.id));
    params = params.append("promoCodeParam", String(promoCode));

    this._dataService
      .getPromotionsHotel(params)
      .subscribe(
        (response: any) => {

          if (response.length == 0) {
            this.generalFunctionsService.notifications('El código promocional no existe, por favor verifique la información ingresada', 'error');
            this.loading = false;
          } else {
            var states = ''
            for (let i = 0; i < response[0].roomTypes.length; i++) {
              params = params.append('roomTypesSpec', String(response[0].roomTypes[i]));
              if (response[0].roomTypes[i]) {
                states += String(response[0].roomTypes[i]) + ((i + 1) == response[0].roomTypes.length ? '' : ',')
              }

            }
            this.getRooms(startDate, finishDate, numberAdult, promoCode, states);
          }


        },
        (error) => {
          console.log(<any>error);
        }
      );
  }




  getRooms(startDate, finishDate, numberAdult, promoCode = null, states = null) {
    let params = new HttpParams();
    params = params.append('affiliateIdSpec', String(this.establismentInformation.id));
    params = params.append('arrivalDateSpec', String(startDate));
    params = params.append('departureDateSpec', String(finishDate));

    if (this.roomTypeAvailable && this.roomTypeAvailable != "todas") {
      params = params.append('roomTypesSpec', String(this.roomTypeAvailable));

    }
    this._dataReservationService.dataRoomAvailableOurRooms(params).subscribe(
      response => {

        var capacityTotal = 0;
        if (response.length) {
          let i;
          for (i = 0; i < response.length; i++) {

            capacityTotal += response[i].capacity;

          }

          if (capacityTotal < numberAdult) {

            this.generalFunctionsService.notifications(this.termsConditions ? this.termsConditions : 'Apreciado cliente no hay disponibilidad para la cantidad de personas que ha indicado, por favor seleccione otras fechas', 'error');
            this.loading = false;

          } else {
            this.loading = false;
            this.router.navigate([this.establismentInformation.token + '/our-rooms-disponibility', startDate, finishDate, numberAdult, promoCode ? promoCode : 'ninguno', this.roomTypeAvailable ? this.roomTypeAvailable : states ? states : 'todas']);
          }

        } else {

          this.generalFunctionsService.notifications(this.termsConditions ? this.termsConditions : 'Apreciado cliente no hay disponiblidad en las fechas seleccionadas', 'error');
          this.loading = false

        }

      },
      error => {


        if (error.error.message.indexOf("Base rate not found") != -1) {
          this.generalFunctionsService.notifications('No hay tarifas registradas para este año, no puede reservar', 'error');

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


}
