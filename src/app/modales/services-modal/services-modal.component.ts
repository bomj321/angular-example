import { Component, OnInit, Injectable, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { DataHomeService } from '../../services/data-home.service';

@Component({
  selector: 'app-services-modal',
  templateUrl: './services-modal.component.html',
  styleUrls: ['./services-modal.component.scss'],
  providers: [DataHomeService]

})
export class ServicesModalComponent implements OnInit {

  @Input() establismentInformation = null;
  public server: string = environment.API_URL;
  public hotelInformation: any;
  public loading: any;

  constructor(
    public activeModal: NgbActiveModal,
    private _dataService: DataHomeService
  ) { }



  ngOnInit() {
    this.informationHotel();
  }


  close() {
    this.activeModal.dismiss('close');
  }

  public informationHotel() {
    this.loading = true;
    this._dataService.informationHotelCarrusel(this.establismentInformation.id).subscribe(
      response => {
        this.hotelInformation = response;
        this.loading = false;

      },
      error => {
        console.log(<any>error);
        this.loading = false;

      }
    );
  }


}
