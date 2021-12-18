import { Component, OnInit, Injectable, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReservationService } from '../../services/reservation.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-place-modal',
  templateUrl: './place-modal.component.html',
  styleUrls: ['./place-modal.component.scss'],
  providers: [ReservationService]

})
export class PlaceModalComponent implements OnInit {

  @Input() title = null;
  @Input() place = null;
  public server: string = environment.API_URL;

  constructor(
    public activeModal: NgbActiveModal
  ) { }



  ngOnInit() 
  {
  }


  
 


  close() {
    this.activeModal.dismiss('close');
  }
  




}
