import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from "@angular/common";

import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { HttpClientModule } from "@angular/common/http";
import localeEs from "@angular/common/locales/es";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { routing, appRoutingProviders } from "./app.routing";

import { AppComponent } from "./app.component";

import { DataHomeService } from "./services/data-home.service";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { ModalesModule } from "../app/modales/modales.module";

/******************Components***********************/
import { HomeComponent } from "./components/home/home.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { ClientSayHomeComponent } from "./components/client-say-home/client-say-home.component";
import { BestPlacesHomeComponent } from "./components/best-places-home/best-places-home.component";
import { OurRoomsHomeComponent } from "./components/our-rooms-home/our-rooms-home.component";
import { AboutHomeComponent } from "./components/about-home/about-home.component";
import { TopWrapperHomeComponent } from "./components/top-wrapper-home/top-wrapper-home.component";
import { CarruselHomeComponent } from "./components/carrusel-home/carrusel-home.component";
import { LatestNewsHomeComponent } from "./components/latest-news-home/latest-news-home.component";
import { DetailsRoomsComponent } from "./components/details-rooms/details-rooms.component";
import { SearchWrapperComponent } from "./components/search-wrapper/search-wrapper.component";
import { DestinosComponent } from "./components/destinos/destinos.component";
import { DestinoComponent } from "./components/destino/destino.component";
import { FooterComponent } from "./components/footer/footer.component";
/******************Components***********************/

/**********Pages***************/
import { AboutUsPageComponent } from "./components/about-us-page/about-us-page.component";
import { OurRoomsPageComponent } from "./components/our-rooms-page/our-rooms-page.component";
import { PromotionsPageComponent } from "./components/promotions-page/promotions-page.component";

import { ContactUsPageComponent } from "./components/contact-us-page/contact-us-page.component";
import { BarSearchComponent } from "./components/bar-search/bar-search.component";
import { FinalReservationComponent } from "./components/final-reservation/final-reservation.component";
import { OurRoomsDisponibilityPageComponent } from "./components/our-rooms-disponibility-page/our-rooms-disponibility-page.component";
import { ServicePageComponent } from "./components/service-page/service-page.component";

/**********Pages***************/
import { SafeHtmlPipe } from './services/pipes/safe-html';
/***Calendar****/

registerLocaleData(localeEs, 'es');

/***Calendar****/
/**************Mini Componentes***************/
import { InputNumberComponent } from "./components/input-number/input-number.component";

/**************Mini Componentes***************/
/********************i18N*********************/
import { TranslateModule } from "@ngx-translate/core";

/********************i18N*********************/
/******************Ellipsis********************/
import { EllipsisModule } from "ngx-ellipsis";
/******************Ellipsis********************/
/*********Directives****************/
import { FormDirective } from "./form.directive";
/*********Directives****************/
/************Toastr*********/
import { CommonModule } from "@angular/common";
import { ToastrModule } from "ngx-toastr";
// import { Utils } from "./utils";
/************Toastr*********/
import { CarouselModule } from "ngx-owl-carousel-o";

import { OurOffersPageComponent } from "./components/our-offers-page/our-offers-page.component";
import { GalleryComponent } from "./components/gallery/gallery.component";
import { LightboxModule } from "ngx-lightbox";
import { NgxGalleryModule } from "ngx-gallery";

/********************MATMODULES*********************** */
// import { MatStepperModule } from "@angular/material/stepper";
// import { MatIconModule } from "@angular/material/icon";

/******LEAFLET MAP */
// import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { UrlAuthGuard } from "./_guards/url-auth.guard";
import { NgxLoadingModule } from "ngx-loading";
import { InfiniteScrollModule } from "ngx-infinite-scroll";

/****READ MORE****/
import { ReadMoreComponent } from "./components/read-more/read-more.component";
import { SEOService } from './services/seo.service';
import { HotelResolver } from './resolvers/hotel.resolver';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    ClientSayHomeComponent,
    BestPlacesHomeComponent,
    OurRoomsHomeComponent,
    AboutHomeComponent,
    TopWrapperHomeComponent,
    CarruselHomeComponent,
    LatestNewsHomeComponent,
    DetailsRoomsComponent,
    SearchWrapperComponent,
    FooterComponent,
    ContactUsPageComponent,
    AboutUsPageComponent,
    OurRoomsPageComponent,
    PromotionsPageComponent,
    BarSearchComponent,
    FinalReservationComponent,
    OurRoomsDisponibilityPageComponent,
    InputNumberComponent,
    FormDirective,
    DestinosComponent,
    DestinoComponent,
    OurOffersPageComponent,
    GalleryComponent,
    ReadMoreComponent,
    ServicePageComponent,
    SafeHtmlPipe
  ],
  imports: [
    EllipsisModule,
    // MatStepperModule,
    // MatIconModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    NgSelectModule,
    routing,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    ModalesModule,
    TranslateModule.forRoot(),  
    CommonModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    CarouselModule,
    LightboxModule,
    NgxGalleryModule,
    // LeafletModule,
    NgxLoadingModule,
    InfiniteScrollModule,
  ],
  providers: [appRoutingProviders, HotelResolver,SEOService, DataHomeService, UrlAuthGuard,  { provide: LOCALE_ID, useValue: "es" }],
  bootstrap: [AppComponent],
})
export class AppModule {}
