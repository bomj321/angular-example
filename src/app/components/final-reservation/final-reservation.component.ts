import { ReservationService } from '../../services/reservation.service';
import { environment } from '../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataHomeService } from '../../services/data-home.service';

@Component({
  selector: 'app-final-reservation',
  templateUrl: './final-reservation.component.html',
  styleUrls: ['./final-reservation.component.css'],
  providers: [ReservationService, DataHomeService]

})
export class FinalReservationComponent implements OnInit {

  /**************Other variables****************/
  public server: string = environment.API_URL;
  public arrayDataTotal: any;
  public roomsAvailables: any;
  private subRoute: any;
  public conditionalForView: any;
  public informationsOurRoomSection: any;
  public roomsTypeAvailables: any;

  /**************Other variables****************/
  /*****Variables of route***********/
  public routeIdRoom: any;
  public routeTypeRoom: any;
  public routeCheckIn: any;
  public routeCheckOut: any;
  public routeNumberAdult: any;
  public routeNumberChildren: any;
  public routeRoomsTypeAvailables: any;
  public establismentInformation: any;



  /*****Variables of route***********/
  constructor(
    private _dataReservationService: ReservationService,
    private _dataService: DataHomeService,
    private router: Router,
    private route: ActivatedRoute,
    private _http: HttpClient,
  ) {

  }

  ngOnInit() {
    this.subRoute = this.route.params.subscribe(params => {
      this.roomsAvailables = [];
      this.roomsTypeAvailables = [];

      this.routeIdRoom = params['idRoom'];
      this.routeTypeRoom = params['typeRoom'];

      this.routeCheckIn = params['newFormatCheckIn'];
      this.routeCheckOut = params['newFormatCheckOut'];
      this.routeNumberAdult = params['numberAdult'];
      this.routeNumberChildren = params['numberChildren'];
      this.conditionalForView = false;

      this.getUrlParameters();


    });

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


          this.informationHotel(this.routeIdRoom, this.routeTypeRoom, this.routeCheckIn, this.routeCheckOut, this.routeNumberAdult, this.routeNumberChildren);
          this.informationOurRoomData();
        }



      },
      error => {
        this.router.navigate(['/hotel/not-found']);
        console.log(<any>error);

      }
    );
  }





  public informationOurRoomData() {
    this._dataService.informationOurRooms(this.establismentInformation.id).subscribe(
      response => {

        this.informationsOurRoomSection = response;


        let i;
        for (i = 0; i < response.length; i++) {

          this.roomsTypeAvailables.push({
            nameTypeRoom: response[i].name,
          });
        }

      },
      error => {
        console.log(<any>error);

      }
    );
  }



  public informationHotel(routeIdRoom, routeTypeRoom, routeCheckIn, routeCheckOut, routeNumberAdult, routeNumberChildren) {




    this._dataReservationService.dataRoomAvailable(this.server, routeCheckIn, routeCheckOut, routeTypeRoom).subscribe(
      response => {
        //this.roomsAvailables = response;
        let i;
        for (i = 0; i < response.length; i++) {

          if (response[i].name == routeTypeRoom && response[i].id == routeIdRoom) {

            this.roomsAvailables.push({
              roomInformation: response[i],
              routeCheckIn: routeCheckIn,
              routeCheckOut: routeCheckOut,
              routeNumberAdult: routeNumberAdult[0],
              routeNumberChildren: routeNumberChildren[0]
            });
          }

        }

        console.warn(this.roomsAvailables);

      },
      error => {
        console.log(<any>error);

      }
    );
  }


}




