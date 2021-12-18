import { Component, OnInit, Injectable, Input, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataHomeService } from '../../services/data-home.service';
import { environment } from '../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlaceModalComponent } from '../../modales/place-modal/place-modal.component';
import { isPlatformBrowser } from '@angular/common';

declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-best-places-home',
  templateUrl: './best-places-home.component.html',
  styleUrls: ['./best-places-home.component.css'],
  providers: [DataHomeService]
})
export class BestPlacesHomeComponent implements OnInit {

  @Input() establismentInformation = null;
  public server: string = environment.API_URL;
  public booleanButton: any;
  public bestDestinationsAvailables: any;
  isBrowser: boolean;

  constructor(
    private _http: HttpClient,
    private _dataService: DataHomeService,
    private modal: NgbModal, @Inject(PLATFORM_ID) private platformId) {
    this.isBrowser = isPlatformBrowser(this.platformId)
    this.booleanButton = true;
  }

  ngOnInit() {
    this.informationBestPlaces();
  }

  public informationBestPlaces() {

    this._dataService.informationBestPlaces(this.establismentInformation.id).subscribe(
      response => {


            this.bestDestinationsAvailables = [];
             var a = response.destinations;
             while (a.length > 0) 
             {    
                  var arraySpliced = a.splice(0,3);    
                  this.bestDestinationsAvailables.push(arraySpliced)
             }

        
        /*********************CODE TO RELOAD JQUERY OF SLIDER OF IMAGES*************************/



        setTimeout(function () {
          if(!this.isBrowser) return
          $('.owl-carousel-wide').owlCarousel({
            items: 1,
            loop: true,
            margin: 50,
            autoplay: true,
            autoplayTimeout: 8000
          });
        }, 700);

        /*********************CODE TO RELOAD JQUERY OF SLIDER OF IMAGES*************************/
      },
      error => {
        console.log(<any>error);

      }
    );
  }

  openModalPlace(place) {
    const modal = this.modal.open(PlaceModalComponent);
    modal.componentInstance.title = place.name;
    modal.componentInstance.place = place;
  }



}
