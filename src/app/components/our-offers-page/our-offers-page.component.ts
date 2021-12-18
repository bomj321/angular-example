import { ReservationService } from '../../services/reservation.service';
import { environment } from '../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Router, ActivatedRoute } from "@angular/router";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { DataHomeService } from '../../services/data-home.service';
//import { OffersService} from '../../services/offers.service';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-our-offers-page',
  templateUrl: './our-offers-page.component.html',
  styleUrls: ['./our-offers-page.component.css'],
  providers: [ ReservationService,DataHomeService ]

})
export class OurOffersPageComponent implements OnInit {

 /****************Variables for pagination********************/
public pageSize: number; 
public page: number;

/****************Variables for pagination********************/

/**************Other variables****************/
  public server: string = environment.API_URL;
  public server_rate: string = environment.API_URL_RATE;

  public informationsOurRoomSection: any;
  public informationOurOffers :any;

/**************Other variables****************/
  constructor(
  	  private _dataReservationService: ReservationService,
      private _dataService: DataHomeService,
      private router: Router,
      private route: ActivatedRoute,
      private _http: HttpClient,
      //private offersService : OffersService
  	) 
  { 
  	this.pageSize = 5;
  	this.page = 1;
  }

  ngOnInit() 
  {
          
        // this.informationOurRooms();
       
  }


public informationOffers () {

   this._dataService.dataOffers().subscribe(
    response => {

      this.informationOurOffers = response;

    },
    error => {                                      
      console.log(<any>error);
     
    }
  ) 
  
}

  /*public informationOurRooms()
  {               

    this._dataService.informationOurRooms().subscribe(
          response => {

             console.log(response);  
                this.informationsOurRoomSection = response;
                 $('.select2').select2({
                minimumResultsForSearch: Infinity,
          });        
                //console.log(this.informationsOurRoomSection);


               // console.log(this.roomsTypeAvailables);
            
          },
          error => {                                      
            console.log(<any>error);
           
          }
      );
  }*/


}
