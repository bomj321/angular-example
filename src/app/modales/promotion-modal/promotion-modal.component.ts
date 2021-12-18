import { Component, OnInit, Injectable, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { DataHomeService } from '../../services/data-home.service';

@Component({
  selector: 'app-promotion-modal',
  templateUrl: './promotion-modal.component.html',
  styleUrls: ['./promotion-modal.component.scss'],
  providers: [DataHomeService]

})
export class PromotionModalComponent implements OnInit {

  @Input() promotion = null;

  constructor(
    public activeModal: NgbActiveModal,
  ) { }



  ngOnInit() {
    console.log(this.promotion);
    //this.informationHotel();
  }


  close() {
    this.activeModal.dismiss('close');
  }




}
