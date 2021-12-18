import { Component, OnInit, Injectable, Input, Output, EventEmitter } from '@angular/core';
import { DataHomeService } from '../../services/data-home.service';
import { environment } from '../../../environments/environment';
import { Utils } from '../../utils';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpParams } from '@angular/common/http';


declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-carrusel-home',
  templateUrl: './carrusel-home.component.html',
  styleUrls: ['./carrusel-home.component.css']
})
export class CarruselHomeComponent implements OnInit {

  @Input() establismentInformation = null;

  public server: string = environment.API_URL;
  public imageArrayCarrusel: any[] = [];

  public customOptions: OwlOptions = {
    autoplay: true,
    nav: true,
    dots: false,
    loop: true,
    navSpeed: 1500,
    items: 1,
    navText: [`<i class='fa fa-chevron-circle-left fa-chevron-hover' aria-hidden='true'></i>`, `<i class='fa fa-chevron-circle-right fa-chevron-hover' aria-hidden='true'></i>`]
  }

  @Input('informationHotelCarrusel') informationHotelCarrusel: any;
  @Input('informationsMainServices') informationsMainServices: any;
  @Input('roomsTypeAvailables') roomsTypeAvailables: any;

  constructor(
    private _dataService: DataHomeService,

  ) { }

  ngOnInit() {
    this.imageArrayCarrusel = [];
    this.imageCarrusel();
    this.verifyNull();
  }


  public imageCarrusel() {
    let params = new HttpParams();
    params = params.append('size', String(4));
    this._dataService.imageCarrusel(this.establismentInformation.id, params).subscribe(
      response => {


        /******************************************Code for randoms items*****************************/
        var imageServicesRandom = [];
        if (this.informationsMainServices) {
          for (var i = 0; i < this.informationsMainServices.length; i++) {

            if (i == 4) {
              break;
            }

            var imagesServices = this.informationsMainServices;
            var rand = imagesServices[Math.floor(Math.random() * this.informationsMainServices.length)];
            imageServicesRandom.push(rand);


          }
        }

        /******************************************Code for randoms items*****************************/
        this.imageArrayCarrusel = response;
      },
      error => {
        console.log(<any>error);

      }
    );
  }


  verifyNull() {
    return Utils.isNullOrEmpty(this.informationsMainServices);
  }

  /****Hover effect****/

}
