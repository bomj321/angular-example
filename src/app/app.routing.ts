import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./components/home/home.component";
import { DetailsRoomsComponent } from "./components/details-rooms/details-rooms.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";

/*******PAGES************/
import { OurRoomsPageComponent } from "./components/our-rooms-page/our-rooms-page.component";
import { AboutUsPageComponent } from "./components/about-us-page/about-us-page.component";
import { ContactUsPageComponent } from "./components/contact-us-page/contact-us-page.component";
import { FinalReservationComponent } from "./components/final-reservation/final-reservation.component";
import { OurRoomsDisponibilityPageComponent } from "./components/our-rooms-disponibility-page/our-rooms-disponibility-page.component";
import { PromotionsPageComponent } from "./components/promotions-page/promotions-page.component";

import { DestinosComponent } from "./components/destinos/destinos.component";
import { DestinoComponent } from "./components/destino/destino.component";
import { OurOffersPageComponent } from "./components/our-offers-page/our-offers-page.component";
import { GalleryComponent } from "./components/gallery/gallery.component";
import { ServicePageComponent } from "./components/service-page/service-page.component";
import { HotelResolver } from './resolvers/hotel.resolver';

/*******PAGES************/
const appRoutes: Routes = [
  { path: ":hotelSlug", component: HomeComponent, resolve: {
    resolveData: HotelResolver
  } },
  { path: ":hotelSlug/about-us", component: AboutUsPageComponent, resolve: {
    resolveData: HotelResolver
  } },
  { path: ":hotelSlug/our-rooms", component: OurRoomsPageComponent, resolve: {
    resolveData: HotelResolver
  } },
  { path: ":hotelSlug/our-rooms/:date", component: OurRoomsPageComponent,
    // resolve: {resolveData: HotelResolver}
  },
  {
    path:
      ":hotelSlug/our-rooms-disponibility/:newFormatCheckIn/:newFormatCheckOut/:numberAdult/:promoCode/:roomType",
    component: OurRoomsDisponibilityPageComponent,
  },
  {
    path:
      ":hotelSlug/promotions",
    component: PromotionsPageComponent,
    // resolve: { resolveData: HotelResolver },
  },
  { path: ":hotelSlug/our-offers", component: OurOffersPageComponent },
  { path: ":hotelSlug/gallery", component: GalleryComponent,
    resolve: {
      resolveData: HotelResolver
    }
  },
  { path: ":hotelSlug/services", component: ServicePageComponent,
    resolve: {
      resolveData: HotelResolver
    }
  },
  { path: ":hotelSlug/destinations", component: DestinosComponent },
  { path: ":hotelSlug/destino/:idDestino/:name", component: DestinoComponent },
  {
    path:
      ":hotelSlug/final-reservation/:idRoom/:typeRoom/:newFormatCheckIn/:newFormatCheckOut/:numberAdult/:promoCode",
    component: FinalReservationComponent,
  },
  { path: ":hotelSlug/contact-us", component: ContactUsPageComponent,
    resolve: {
      resolveData: HotelResolver
    }
  },
  {
    path: ":hotelSlug/details-rooms/:idRoom",
    component: DetailsRoomsComponent,
  },
  { path: "hotel/not-found", component: NotFoundComponent },
  { path: "**", component: NotFoundComponent },
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
