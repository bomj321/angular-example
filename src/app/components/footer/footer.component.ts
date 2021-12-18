import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataHomeService } from '../../services/data-home.service';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit, Injectable, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  @Input() establismentInformation = null;

  public server: string = environment.API_URL;
  public serverWs: string = environment.API_URL_WS;
  public bestDestinationsAvailablesFooter: any;
  public informationHotelFooter: any;
  public sectionHidden: any = [];

  constructor(
       private _dataService: DataHomeService,
       private router: Router,
       private route: ActivatedRoute
  	) { }

  ngOnInit() 
  {
    this.informationBestPlaces();
    this.informationHotel();    
    this.aboutUsSection();
    this.informationOurRooms();
    this.getGallery();

  }

 

  public informationBestPlaces()
  {               

    this._dataService.informationBestPlaces(this.establismentInformation.id).subscribe(
          response => {
                this.bestDestinationsAvailablesFooter = response.destinations;
                if (response.length > 0) {
                  this.sectionHidden['places'] = true;
                } else {
                  this.sectionHidden['places'] = false;
                }           
          },
          error => {                                      
            console.log(<any>error);
           
          }
      );
  }

   public informationHotel()
  {               

    this._dataService.informationHotelCarrusel(this.establismentInformation.id).subscribe(
          response => {
         
            this.informationHotelFooter   = response;
        
          },
          error => {                                      
            console.log(<any>error);
           
          }
      );
  }


  /********APIs verify**** */

  public aboutUsSection() {
    this._dataService.aboutSectionCarousel(this.establismentInformation.id).subscribe(
      response => {
        if (response.length > 0) {
          this.sectionHidden['aboutUs'] = true;
        } else {
          this.sectionHidden['aboutUs'] = false;
        }

      },
      error => {
        console.log(<any>error);

      }
    );
  }


  public informationOurRooms() {

    this._dataService.informationOurRoomsHome(this.establismentInformation.id).subscribe(
      response => {

        if (response.length > 0) {
          this.sectionHidden['rooms'] = true;
        } else {
          this.sectionHidden['rooms'] = false;
        }


      },
      error => {
        console.log(<any>error);

      }
    );
  }

  public getGallery() {

    this._dataService.imageCarrusel(this.establismentInformation.id).subscribe(
      response => {

        if (response.length > 0) {
          this.sectionHidden['gallery'] = true;
        } else {
          this.sectionHidden['gallery'] = false;
        }


      },
      error => {
        console.log(<any>error);

      }
    )

  }


}
