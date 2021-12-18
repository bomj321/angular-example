import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from './modal/modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ConditionsModalComponent } from './conditions-modal/conditions-modal.component';
import { PlaceModalComponent } from './place-modal/place-modal.component';
import { ServicesModalComponent } from './services-modal/services-modal.component';
import { PromotionModalComponent } from './promotion-modal/promotion-modal.component';
import { PaymentModalComponent } from './payment-modal/payment-modal.component';


// import {MatStepperModule} from '@angular/material/stepper';
// import {MatFormFieldModule} from '@angular/material/form-field';
import { NgxLoadingModule } from "ngx-loading";

@NgModule({
  declarations: [
    ModalComponent,
    ConditionsModalComponent,
    PlaceModalComponent,
    ServicesModalComponent,
    PromotionModalComponent,
    PaymentModalComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    // MatStepperModule,
    // MatFormFieldModule,
    NgxLoadingModule,
    ToastrModule.forRoot() // ToastrModule added
  ],
  exports:
    [
      ModalComponent
    ],
  entryComponents:
    [
      ModalComponent,
      ConditionsModalComponent,
      PlaceModalComponent,
      ServicesModalComponent,
      PromotionModalComponent,
      PaymentModalComponent
    ],
})
export class ModalesModule { }
