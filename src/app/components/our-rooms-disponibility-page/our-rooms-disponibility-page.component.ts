import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from '../../../environments/environment';
import { DataHomeService } from '../../services/data-home.service';
import { ReservationService } from '../../services/reservation.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxGalleryOptions, NgxGalleryAnimation } from 'ngx-gallery';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConditionsModalComponent } from '../../modales/conditions-modal/conditions-modal.component';
import { countriesInformation } from './countriesInformation';
import { GeneralFunctionsService } from '../../services/general-functions.service'
import { PaymentModalComponent } from '../../modales/payment-modal/payment-modal.component';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-our-rooms-disponibility-page',
  templateUrl: './our-rooms-disponibility-page.component.html',
  styleUrls: ['./our-rooms-disponibility-page.component.css'],
  providers: [ReservationService, DataHomeService]

})
export class OurRoomsDisponibilityPageComponent implements OnInit {

  public Math: any;
  /****************Variables for pagination********************/
  public pageSize: number;
  public page: number;

  /****************Variables for pagination********************/

  /**************Other variables****************/
  public server: string = environment.API_URL;
  public server_rate: string = environment.API_URL_RATE;

  public arrayDataTotal: any;
  public roomsAvailables: any;
  public subRoute: any;
  public conditionalForView: any;
  public informationsOurRoomSection: any;
  public roomsTypeAvailables: any;
  public countriesData: any;
  public departaments: any;
  public municipalities: any;
  public informationHotel: any;
  /**************Other variables****************/
  /*****Variables of route***********/
  public routeCheckIn: any;
  public routeCheckOut: any;
  public routeNumberAdult: any;
  public promoCode: any;
  public roomTypeAvailable: any;
  public countryDefault = 52;
  public ivaHotel: any;
  public paymentMethod: boolean;

  /*****Variables of route***********/

  /**Variables for views**/
  public roomsSelectedArray: any;
  public booleanPage: boolean
  public reserveForm: FormGroup;;
  public roomsSelectedArrayToJson: any;
  public dateDiff: any;
  public totalPrice: any;
  public totalPriceWithIva: any;
  public totalGuest: any;
  /**Variables for views**/

  public isNotColombian: boolean = false;

  public establismentInformation: any;
  public galleryOptions: NgxGalleryOptions[];
  public blockRequest: any = 0;
  public loading: any;

  /*****NEW VARIABLES***** */

  public blockAlertNumberGuests: boolean = true;
  public isEditable = true;
  public tipeView: any = 1;

  /**********Countries**** */
  public countriesSelect = countriesInformation;
  public identificationTypeSelect = [
    {
      value: "1",
      name: "Tj. identificación"
    },

    {
      value: "2",
      name: " Cd. extranjería"
    },

    {
      value: "3",
      name: " Cd. ciudadanía"
    },

    {
      value: "4",
      name: "Pasaporte"
    },
  ];

  constructor(
    private _dataReservationService: ReservationService,
    private _dataService: DataHomeService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    private generalFunctionsService: GeneralFunctionsService


  ) {
    this.Math = Math;
    this.pageSize = 4;
    this.page = 1;
    this.booleanPage = false;
  }

  ngOnInit() {
    this.subRoute = this.route.params.subscribe(params => {

      this.galleryOptions = [
        // max-width 1900
        {
          breakpoint: 1900,
          width: '100%',
          height: '250px'
        },

        // max-width 991
        {
          breakpoint: 991,
          width: '100%',
          height: '200px'
        },
        // max-width 400
        {
          "thumbnails": false,
          imageAnimation: NgxGalleryAnimation.Slide,
          imageAutoPlay: true,
          imageAutoPlayInterval: 10000
        },
        {
          breakpoint: 400,
          width: '100%',
          height: '150px',
          preview: false
        }
      ];


      this.booleanPage = false;
      this.roomsSelectedArrayToJson = [];
      this.roomsAvailables = [];
      this.roomsTypeAvailables = [];
      this.roomsSelectedArray = [];
      this.routeCheckIn = params['newFormatCheckIn'];
      this.routeCheckOut = params['newFormatCheckOut'];
      this.roomTypeAvailable = params['roomType'];

      /***********************************Date diference on days*********************************/
      var dateStart = new Date(this.routeCheckIn).getTime();
      var dateEnd = new Date(this.routeCheckOut).getTime();

      if (dateEnd < dateStart) {
        this.generalFunctionsService.notifications('La fecha de salida es menor a la de entrada', 'error');
        this.router.navigate(['/' + params['hotelSlug']]);
      }

      if ((dateEnd - dateStart) / (1000 * 60 * 60 * 24) == 0) {
        this.dateDiff = 1;
      } else {
        this.dateDiff = (dateEnd - dateStart) / (1000 * 60 * 60 * 24);

      }

      /***********************************Date diference on days*********************************/
      this.routeNumberAdult = params['numberAdult'];
      this.promoCode = params['promoCode'] == 'ninguno' ? null : params['promoCode'];
      this.conditionalForView = false;
      this.initContactForm();
      this.getUrlParameters();

    });
  }

  getUrlParameters() {
    this.loading = true;
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

          this.ivaHotel = response['iva'] ? parseInt(response['iva']) : 0;
          this.establismentInformation = response;
          this.informationHotel = response;
          this.paymentMethod = (!response['paymentMethod'] || response['paymentMethod'] == 'undefined' || response['paymentMethod'] == 2) ? false : true;
          this.informationHotelRoomAvailable(this.routeCheckIn, this.routeCheckOut, this.roomTypeAvailable, this.routeNumberAdult, this.promoCode);

        }

      },
      error => {
        this.router.navigate(['/hotel/not-found']);
        console.log(<any>error);
        this.loading = false;

      }
    );
  }

  /*****************Functions for reserve****************/

  /*public informationHotelData() {
    this.loading = true;

    this._dataService.informationHotelCarrusel(this.establismentInformation.id).subscribe(
      response => {

        this.informationHotel = response;

        let checkInDate = new Date(this.routeCheckIn);
          let checkOutDate = new Date(this.routeCheckOut);
  
          let checkInDateDays = checkInDate.setDate(checkInDate.getDate() + 1);
          let checkOutDateDays = checkOutDate.setDate(checkOutDate.getDate() + 1);

        this.loading = false;

      },
      error => {
        console.log(<any>error);
        this.loading = false;

      }
    );
  }*/

  public initContactForm() {
    this.reserveForm = this.formBuilder.group({
      empressSwitch: [false],
      customerFullname: [null],
      customerEmail: [null, [Validators.email, Validators.required]],
      customerEmailVerified: [null, [Validators.email, Validators.required]],
      identificationType: ["1", Validators.required],
      type: [1, Validators.required],
      identification: [null, Validators.required],
      countryId: [52, Validators.required],
      customerCellPhone: [null, Validators.required],
      customerEmpressNit: [null],
      countryInformationDefault: ["57"],
      customerEmpressName: [null],
      mainGuest: [false],
      policityTerms: [false, Validators.required],
      dataTreatment: [false, Validators.required],
      notes: [null]
    });
  }



  public countries() {

    this.loading = true;

    this._dataReservationService.dataCountries().subscribe(
      response => {
        this.countriesData = response.content;
        this.loading = false;
        //this.informationHotelData();
      },
      error => {
        console.log(<any>error);
        this.loading = false;


      }
    );
  }


  public onFormSubmit(dataForm) {

    $("#identificationType").removeClass("ng-invalid-class");
    $("#identification").removeClass("ng-invalid-class");
    $("#customerFullname").removeClass("ng-invalid-class");
    $("#type").removeClass("ng-invalid-class");
    $("#customerEmail").removeClass("ng-invalid-class");
    $("#customerEmailVerified").removeClass("ng-invalid-class");
    $("#customerEmail").removeClass("ng-invalid-class");
    $("#customerCellPhone").removeClass("ng-invalid-class");
    $("#countryId").removeClass("ng-invalid-class");
    $("#customCheckGuest").removeClass("ng-invalid-class");
    $("#customerEmpressName").removeClass("ng-invalid-class");
    $("#customerEmpressNit").removeClass("ng-invalid-class");


    if (this.reserveForm.value.identificationType == '' || this.reserveForm.value.identificationType == null || this.reserveForm.value.identificationType == 'undefined') {
      this.generalFunctionsService.notifications('Debes ingresar un tipo de identificación', 'error');
      let element = document.getElementById("identificationType");
      $("#identificationType").addClass("ng-invalid-class");
      element.focus();
      return;
    }


    if (this.reserveForm.value.identification == '' || this.reserveForm.value.identification == null || this.reserveForm.value.identification == 'undefined') {
      this.generalFunctionsService.notifications('Debes ingresar una identificación', 'error');
      let element = document.getElementById("identification");
      $("#identification").addClass("ng-invalid-class");
      element.focus();
      return;
    }



    if (this.reserveForm.value.customerFullname == '' || this.reserveForm.value.customerFullname == null || this.reserveForm.value.customerFullname == 'undefined') {
      this.generalFunctionsService.notifications('Debes ingresar un nombre de usuario', 'error');
      let element = document.getElementById("customerFullname");
      $("#customerFullname").addClass("ng-invalid-class");
      element.focus();
      return;
    }



    if (this.reserveForm.value.customerEmail == '' || this.reserveForm.value.customerEmail == null || this.reserveForm.value.customerEmail == 'undefined') {
      this.generalFunctionsService.notifications('Debes ingresar un correo electrónico', 'error');
      let element = document.getElementById("customerEmail");
      $("#customerEmail").addClass("ng-invalid-class");
      element.focus();
      return;
    }



    if (this.reserveForm.value.customerEmailVerified == '' || this.reserveForm.value.customerEmailVerified == null || this.reserveForm.value.customerEmailVerified == 'undefined') {
      this.generalFunctionsService.notifications('Debes ingresar un correo electrónico para verificar', 'error');
      let element = document.getElementById("customerEmailVerified");
      $("#customerEmailVerified").addClass("ng-invalid-class");
      element.focus();
      return;
    }



    if (this.reserveForm.value.customerEmail != this.reserveForm.value.customerEmailVerified) {
      this.generalFunctionsService.notifications('Los correos electrónicos no son iguales, por favor verifica', 'error');
      let element = document.getElementById("customerEmail");
      $("#customerEmail").addClass("ng-invalid-class");
      element.focus();
      return;
    }

    if (this.reserveForm.value.customerCellPhone == '' || this.reserveForm.value.customerCellPhone == null || this.reserveForm.value.customerCellPhone == 'undefined') {
      this.generalFunctionsService.notifications('Debes un celular de contacto', 'error');
      let element = document.getElementById("customerCellPhone");
      $("#customerCellPhone").addClass("ng-invalid-class");
      element.focus();
      return;
    }




    if (this.reserveForm.value.countryId == '' || this.reserveForm.value.countryId == null || this.reserveForm.value.countryId == 'undefined') {
      this.generalFunctionsService.notifications('Debes ingresar un país', 'error');

      let element = document.getElementById("countryId");
      $("#countryId").addClass("ng-invalid-class");
      element.focus();
      return;
    }


    if (this.reserveForm.value.empressSwitch) {
      if (this.reserveForm.value.customerEmpressName == '' || this.reserveForm.value.customerEmpressName == null || this.reserveForm.value.customerEmpressName == 'undefined') {
        this.generalFunctionsService.notifications('Debes ingresar la identification de la empresa', 'error');
        let element = document.getElementById("customerEmpressName");
        $("#customerEmpressName").addClass("ng-invalid-class");
        element.focus();
        return;
      }

      if (this.reserveForm.value.customerEmpressNit == '' || this.reserveForm.value.customerEmpressNit == null || this.reserveForm.value.customerEmpressNit == 'undefined') {
        this.generalFunctionsService.notifications('Debes ingresar un nombre de empresa', 'error');
        let element = document.getElementById("customerEmpressNit");
        $("#customerEmpressNit").addClass("ng-invalid-class");
        element.focus();
        return;
      }
    }




    if (!this.reserveForm.value.policityTerms) {
      this.generalFunctionsService.notifications('Debes aceptar los términos y condiciones', 'error');
      let element = document.getElementById("customCheckTerms");
      $("#customCheckTerms").addClass("ng-invalid-class");
      element.focus();
      return;
    }

    if (!this.reserveForm.value.dataTreatment) {
      this.generalFunctionsService.notifications('Debes aceptar las politicas de tratamiento de datos', 'error');
      let element = document.getElementById("customCheckTreatment");
      $("#customCheckTreatment").addClass("ng-invalid-class");
      element.focus();
      return;
    }

    if (this.reserveForm.valid && this.blockRequest == 0) {

      Swal({
        title: '¿Estás seguro de la reserva?',
        text: '',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí,estoy seguro!',
        cancelButtonText: 'No, aún no'
      }).then((result) => {
        if (result.value) {
          this.loading = true;
          this.blockRequest = 1;

          var sumaTotalPrice = 0;
          var sumaTotalGuests = 0;

          /************************Format array with rooms***********************/
          let i;
          for (i = 0; i < this.roomsSelectedArray.length; i++) {

            this.roomsSelectedArrayToJson.push({
              arrivalDate: this.roomsSelectedArray[i].informationRoomSelected.routeCheckIn,
              departureDate: this.roomsSelectedArray[i].informationRoomSelected.routeCheckOut,
              pricePerNight: Math.ceil(this.roomsSelectedArray[i].informationRoomSelected.roomInformation.pricePerNight.pricePerNightWithoutIva),
              totalPrice: Math.ceil(this.roomsSelectedArray[i].informationRoomSelected.roomInformation.pricePerNight.pricePerNightWithoutIva),
              iva: !this.isNotColombian ? this.roomsSelectedArray[i].informationRoomSelected.roomInformation.pricePerNight.iva : 0,
              guests: parseInt(this.roomsSelectedArray[i].numberPersons),
              roomType:
              {
                id: this.roomsSelectedArray[i].informationRoomSelected.roomInformation.roomTypeHome.id
              },
              applyIva: !this.isNotColombian ? 1 : 0,
              allInclusive: 0,
              allInclusivePercent: 0,
              breakfastIncluded: 0,
              breakfastPercent: 0,
            });

            sumaTotalPrice += Math.ceil((this.roomsSelectedArray[i].informationRoomSelected.roomInformation.pricePerNight.pricePerNightWithoutIva)) * this.dateDiff;

            sumaTotalGuests += parseInt(this.roomsSelectedArray[i].numberPersons);

          }


          /************************Format array with rooms***********************/



          const dataCustom =
          {
            arrivalDate: this.routeCheckIn,
            departureDate: this.routeCheckOut,
            customerFullname: dataForm.customerFullname,
            customerEmail: dataForm.customerEmail,
            customerCellPhone: "+" + dataForm.countryInformationDefault + " " + dataForm.customerCellPhone,
            customerPhone: dataForm.customerPhone,
            totalGuests: sumaTotalGuests,
            totalPrice: sumaTotalPrice,
            allInclusive: 0,
            allInclusivePercent: 0,
            breakfastIncluded: 0,
            breakfastPercent: 0,
            deposit: 0,
            onlineReservationPrice: 0,
            notes: dataForm.notes,
            origin: 1,
            state: 0,
            canCancel: 1,
            //   customerId: 14,
            totalChildrens: 0,
            affiliateId: this.establismentInformation.id,
            mainGuest: 1,
            customer:
            {
              identificationType: dataForm.empressSwitch ? 5 : dataForm.identificationType, //01: Cédula 02: Tarjeta de identidad 03: Pasaporte 04: Cédula extranjería 05: Visa 06: ID dataForm.empressSwitch ? 5 :
              identification: dataForm.empressSwitch ? dataForm.customerEmpressNit : dataForm.identification,  //Número de cedula
              fullName: dataForm.empressSwitch ? dataForm.customerEmpressName : dataForm.customerFullname,
              email: dataForm.customerEmail,
              cellPhone: "+" + dataForm.countryInformationDefault + " " + dataForm.customerCellPhone,
              type: dataForm.empressSwitch ? 2 : 1,  //(1 - persona | 2- empresa | 3 Agencia)
              phone: dataForm.customerPhone,
              address: dataForm.address,  //Dirección
              countryId: dataForm.countryId   //Array de paises,


            },
            guest:
            {
              identificationType: dataForm.empressSwitch ? 5 : dataForm.identificationType,
              identification: dataForm.empressSwitch ? dataForm.customerEmpressNit : dataForm.identification,
              fullName: dataForm.empressSwitch ? dataForm.customerEmpressName : dataForm.customerFullname,
              email: dataForm.customerEmail,
              phone: dataForm.customerPhone,
              nationality: dataForm.countryId
            },
            applyIva: this.isNotColombian ? 0 : 1,
            preservationRooms: this.roomsSelectedArrayToJson

          }





          this._dataReservationService.reservationForm(dataCustom).subscribe(
            response => {

              this.blockRequest = 0; // Lane for prevent multiple submits
              this.isEditable = false;
              this.loading = false;

              if (this.paymentMethod) {
                const modal = this.modal.open(PaymentModalComponent, { size: 'lg', backdrop: 'static' });
                modal.componentInstance.preservationId = response.preservationId;
                modal.componentInstance.totalPrice = sumaTotalPrice;
                modal.componentInstance.affiliateId = this.establismentInformation.id;
                modal.componentInstance.token = this.establismentInformation.token;
                modal.componentInstance.rnt = this.establismentInformation.rnt;
                modal.componentInstance.hotel = this.establismentInformation.name;

              } else {
                Swal({
                  title: '<strong>Reservado</u></strong>',
                  type: 'success',
                  html:
                    'Tu número de reserva es:<br/><br/>' +
                    '<strong>' + response.code + '</strong>.<br/><br/>' + //
                    'Por favor anótalo y sigue reservando'
                })
                this.router.navigate(['/' + this.establismentInformation.token]);
              }

            },
            error => {

              if (error.error.message == 'Room Type not available') {
                this.generalFunctionsService.notifications('La habitación que intenta reservar no está disponible', 'error');
              } else {
                this.generalFunctionsService.notifications('Ha ocurrido un error al intentar reservar', 'error');
              }
              this.blockRequest = 0; // Lane for prevent multiple submits
              console.log(<any>error);
              this.loading = false;

            }
          );

        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.blockRequest = 0; // Lane for prevent multiple submits   
        }
      })

    } else {
      this.generalFunctionsService.notifications('Tiene campos vacios o inválidos.', 'error');
    }


  }

  /*openModalPayment(preservationId, totalPrice, affiliateId) {
    const modal = this.modal.open(PaymentModalComponent, { size: 'lg', backdrop: 'static' });
    modal.componentInstance.preservationId = response.preservationId;
    modal.componentInstance.totalPrice = sumaTotalPrice;
    modal.componentInstance.affiliateId = this.establismentInformation.id;
    modal.componentInstance.rnt = this.establismentInformation.rnt;
    modal.componentInstance.hotel = this.establismentInformation.name;
  }*/


  /*****************Functions for reserve****************/

  public informationOurRoomData() {
    this.loading = true;

    this._dataService.informationOurRooms(this.establismentInformation.id).subscribe(
      response => {

        this.informationsOurRoomSection = response;


        let i;
        for (i = 0; i < response.length; i++) {

          this.roomsTypeAvailables.push({
            nameTypeRoom: response[i].name,
          });
        }

        this.countries();

      },
      error => {
        console.log(<any>error);
        this.loading = false;


      }
    );
  }


  /*******************Information room in view******** */


  public informationHotelRoomAvailable(routeCheckIn, routeCheckOut, routeRoomsTypeAvailables, routeNumberAdult, promoCode) {
    this.loading = true;


    /***Function for filter numbers of string******/
    let params = new HttpParams();
    params = params.append('affiliateIdSpec', String(this.establismentInformation.id));
    params = params.append('arrivalDateSpec', String(routeCheckIn));
    params = params.append('departureDateSpec', String(routeCheckOut));

    if (routeRoomsTypeAvailables != 'todas' && promoCode != 'ninguno') {
      params = params.append('roomTypesSpec', String(routeRoomsTypeAvailables));

    }


    this._dataReservationService.dataRoomAvailableOurRooms(params).subscribe(
      response => {
        if (response.length > 0) {

          response.filter(response => response.pricePerNight != null).forEach(room => {
            this.informationOurRoomDataImages(room, routeCheckIn, routeCheckOut, routeNumberAdult, 0);
          });

        }
        this.informationOurRoomData();
      },
      error => {
        console.log(<any>error);
        this.loading = false;


      }
    );
  }


  public informationOurRoomDataImages(room, routeCheckIn, routeCheckOut, routeNumberAdult, numberChildrenFiltered) {

    this._dataService.informationOurRoom(room.roomTypeHome.id).subscribe(
      roomDetail => {

        var arrayPhotoRoom = roomDetail.roomTypeDetail.images;
        var arrayPhotoDetail = [];

        if (room.roomTypeHome.urlImage) {
          arrayPhotoDetail.push(
            {
              small: this.server + room.roomTypeHome.urlImage,
              medium: this.server + room.roomTypeHome.urlImage,
              big: this.server + room.roomTypeHome.urlImage
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

        this.roomsAvailables.push({
          roomInformation: room,
          routeCheckIn: routeCheckIn,
          routeCheckOut: routeCheckOut,
          routeNumberAdult: routeNumberAdult,
          routeNumberChildren: 0,
          images: arrayPhotoDetail,
          features: roomDetail.roomTypeDetail.features,
          otherData: roomDetail
        });

        if (window.innerWidth <= 991) {
          window.scrollTo(0, 550);
        }

      },

      error => {
        console.log(<any>error);

      }
    );
  }


  /*******************Information room in view******** */

  public addRoom(idRoom, informationRoomSelected) {

    var numberPersons = (<HTMLInputElement>document.getElementById(idRoom)).value;

    let i;

    this.roomsSelectedArray.push({
      informationRoomSelected,
      numberPersons

    });

    var guestTotal = 0;
    var priceSumTotal = 0;
    var priceSumTotalWithIva = 0;
    for (i = 0; i < this.roomsSelectedArray.length; i++) {

      priceSumTotal += Math.ceil((this.roomsSelectedArray[i].informationRoomSelected.roomInformation.pricePerNight.pricePerNightWithoutIva)) * this.dateDiff;
      priceSumTotalWithIva += Math.ceil((this.roomsSelectedArray[i].informationRoomSelected.roomInformation.pricePerNight.promoRate)) * this.dateDiff;
      guestTotal += parseInt(this.roomsSelectedArray[i].numberPersons);
      this.totalPrice = priceSumTotal;
      this.totalPriceWithIva = priceSumTotalWithIva;
      this.totalGuest = guestTotal;

    }

    if (window.scrollY > 1150) {
      window.scrollTo(0, 700);
    }

    this.verifyGuest();

  }

  public deleteRoom(room, price, priceWithIva) {
    this.totalGuest = this.totalGuest - this.roomsSelectedArray[room].numberPersons;
    this.totalPrice = this.totalPrice - Math.ceil(price);
    this.totalPriceWithIva = this.totalPriceWithIva - Math.ceil(priceWithIva);
    this.roomsSelectedArray.splice(room, 1)

    this.verifyGuest();
  }


  verifyGuest() {

    if (this.totalGuest == this.routeNumberAdult) {
      this.blockAlertNumberGuests = false;
    } else {
      this.blockAlertNumberGuests = true;
    }

  }

  public reserveView(boolean) {
    this.booleanPage = boolean;
    if (boolean) {
      this.initContactForm();
      this.countries();
    }

  }

  /********************isNotColombian******** */


  /***************Form reserve**** */

  verifyEmpress() {

    // console.log(this.reserveForm.value.empressSwitch);
    if (this.reserveForm.value.empressSwitch) {
      this.reserveForm.get('mainGuest').setValue(false);

    } else {
      this.reserveForm.get('customerEmpressNit').setValue(null);
      this.reserveForm.get('customerEmpressName').setValue(null);
    }
  }

  openModalConditionsTerms(type, event) {

    event.srcElement.blur();
    event.preventDefault();

    if (type == 'policityTerms') {

      if (this.reserveForm.get('policityTerms').value) {
        const modal = this.modal.open(ConditionsModalComponent);
        modal.componentInstance.title = 'Términos y condiciones';
        modal.componentInstance.type = 1;
        modal.componentInstance.idAffilliate = this.establismentInformation.id;
        modal.componentInstance.onSaveConditionsTerms.subscribe(($e) => {
          if ($e == 'Aceptado') {
            this.reserveForm.get('policityTerms').setValue(true);
          } else {
            this.reserveForm.get('policityTerms').setValue(null);

          }
        })
      } else {
        this.reserveForm.get('policityTerms').setValue(null);
      }
    }



    if (type == 'dataTreatment') {
      if (this.reserveForm.get('dataTreatment').value) {
        const modal = this.modal.open(ConditionsModalComponent);
        modal.componentInstance.title = 'Política de tratamientos de datos';
        modal.componentInstance.type = 2;
        modal.componentInstance.idAffilliate = this.establismentInformation.id;
        modal.componentInstance.onSaveConditionsTerms.subscribe(($e) => {
          if ($e == 'Aceptado') {
            this.reserveForm.get('dataTreatment').setValue(true);
          } else {
            this.reserveForm.get('dataTreatment').setValue(null);

          }
        })

      } else {
        this.reserveForm.get('dataTreatment').setValue(null);
      }
    }

  }

  focusInput() {
    this.changeView(3);

    setTimeout(function () {
      let element = document.getElementById("identification");
      $("#identification").addClass("ng-invalid-class");
      element.focus();
    }, 700);


  }

  openLink(link) {
    if (link && link.split('//')[1] != '' && link.split('//')[1] != undefined && link.split('//')[1] != null) {
      window.open(link, '_blank');

    }
  }

  verifyRooms() {
    if (this.roomsSelectedArray.length == 0) {

      this.generalFunctionsService.notifications('No has seleccionado habitaciones', 'error');
      return;
    }

    if (this.totalGuest > this.routeNumberAdult) {
      Swal("Disculpe!", "El número de huéspedes que indicó en la reserva es mayor a los solicitados en el proceso de búsqueda. Por favor disminuya el número de habitaciones para ajustarlo al total de huéspedes.", "error");
      return;
    }


    if (this.totalGuest < this.routeNumberAdult) {
      Swal("Disculpe!", "El número de huéspedes que indicó en la reserva es menor a los solicitados en el proceso de búsqueda. Por favor agregue otras habitaciones para los demás huéspedes.", "error");
      return;
    }

    this.changeView(2);


  }



  /*************CHANGE VIEW********************** */

  changeView(view) {
    this.tipeView = view;
  }

}