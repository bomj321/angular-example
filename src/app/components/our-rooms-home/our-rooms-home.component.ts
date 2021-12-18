import { Component, OnInit, Input, Inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-our-rooms-home',
  templateUrl: './our-rooms-home.component.html',
  styleUrls: ['./our-rooms-home.component.css']
})
export class OurRoomsHomeComponent implements OnInit {

  @Input() establismentInformation = null;
  @Input('informationsOurRoomSection') informationsOurRoomSection: any;
  
  public server: string = environment.API_URL;
  public Math: any;
  public messageTooltip: any;
  customOptions: OwlOptions = {
    autoplay: true,
    nav: true,
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 1500,
    navText: [`<i class='fa fa-chevron-circle-left fa-chevron-hover' aria-hidden='true'></i>`, `<i class='fa fa-chevron-circle-right fa-chevron-hover' aria-hidden='true'></i>`],
    responsive: {
      0: {
        items: 1
      },   
      768: {
        items: 2
      },     
      992: {
        items: 3
      }
    },
  }


  constructor() { this.Math = Math; }

  ngOnInit() { 
  }

}
