import { Component, OnInit, Injectable, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReservationService } from '../../services/reservation.service';
import { HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-conditions-modal',
  templateUrl: './conditions-modal.component.html',
  styleUrls: ['./conditions-modal.component.scss'],
  providers: [ReservationService]

})
export class ConditionsModalComponent implements OnInit {

  @Output() onSaveConditionsTerms = new EventEmitter();
  @Input() title = null;
  @Input() type = null;
  @Input() idAffilliate = null;
  public loading:any = false;
  public termsConditions:any;
  constructor(
    public activeModal: NgbActiveModal,
    private _dataReservationService: ReservationService,
    private toastr: ToastrService
  ) { }



  ngOnInit() 
  {
    this.getTermsConditions();
  }


  
  getTermsConditions() {

    this.loading = true;
    let params = new HttpParams();
    params = params.append('affiliateIdSpec', String(this.idAffilliate));    
    this._dataReservationService.getTermsConditions(params).subscribe((termsConditions: any) => {
      this.termsConditions = termsConditions;
      this.loading = false;
    },
      error => {
        this.loading = false;
        this.toastr.error('Ha ocurrido un error al obtener los términos y condiciones, por favor contacte con el administrador', 'Error');
      })
  }



  close() {
    this.onSaveConditionsTerms.emit('Cerrado');
    this.activeModal.dismiss('close');
  }
  


  acceptTerms()
  {
    this.onSaveConditionsTerms.emit('Aceptado');
    this.activeModal.dismiss('close');

  }
  

}
