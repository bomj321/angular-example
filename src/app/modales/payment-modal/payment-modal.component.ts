import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from "@angular/router";

declare var $: any;

const url = 'https://console.paymentsconsole.co/template/index.js';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss'],

})

export class PaymentModalComponent implements OnInit {

  @Output() onSaveConditionsTerms = new EventEmitter();
  @Input() preservationId = 0;
  @Input() totalPrice = 0;
  @Input() affiliateId;
  @Input() token;
  @Input() rnt;
  @Input() hotel;


  public loading: any = false;
  public pay: any = false;

  public termsConditions: any;
  constructor(
    private router: Router,
    public activeModal: NgbActiveModal,
  ) { }



  ngOnInit() {
    this.totalPrice = parseInt(this.totalPrice + '00');
  }


  paymentAccept() {
    this.pay = true;
    this.loadScript();

  }

  loadScript() {
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
    this.showSpinner();

  }

  showSpinner() {
    setTimeout(() => {
      //remove the aaa class after 5 seconds
      $('#id-spinner').addClass('d-none');

    }, 7000);
  }

  close() {
    this.onSaveConditionsTerms.emit('Cerrado');
    this.activeModal.dismiss('close');
    this.router.navigate(['/' + this.token]);
  }
}
