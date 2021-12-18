import { Component, OnInit, Injectable, Input, Output, EventEmitter } from '@angular/core';
import { DataHomeService } from '../../services/data-home.service';
import { environment } from '../../../environments/environment';

import { OwlOptions } from 'ngx-owl-carousel-o';


@Component({
  selector: 'app-about-home',
  templateUrl: './about-home.component.html',
  styleUrls: ['./about-home.component.css']
})
export class AboutHomeComponent implements OnInit {

  @Input() establismentInformation = null;
  customOptions: OwlOptions = {
    autoplay: true,
    nav : true,
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 1500,
    navText: [ `<i class='fa fa-chevron-circle-left fa-chevron-hover' aria-hidden='true'></i>`, `<i class='fa fa-chevron-circle-right fa-chevron-hover' aria-hidden='true'></i>`],
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
  }


  paused = false;
  
  public informationHotelFooter: any[] = [];
  
  public server: string = environment.API_URL;
  public imageArrayCarrusel: any[] = [];
  
  constructor(private _dataService: DataHomeService) {
    
   }



  ngOnInit() {
    this.imageCarrusel();
    this.informationHotel();
  }



  public informationHotel()
  {               

    this._dataService.informationHotelCarrusel(this.establismentInformation.id).subscribe(
          response => {
          
            this.informationHotelFooter = response;
        
          },
          error => {                                      
            console.log(<any>error);
           
          }
      );
  }

  public imageCarrusel()
  {   
    
    this._dataService.aboutSectionCarousel(this.establismentInformation.id).subscribe(
        response => {

          this.imageArrayCarrusel = response;

      
        },
        error => {                                      
          console.log(<any>error);
        
        }
    );
  
  }

}
