import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DataHomeService } from '../../services/data-home.service';
// import { circle, geoJSON, icon, latLng, Layer, marker, polygon, tileLayer } from 'leaflet';
import { Router, ActivatedRoute } from "@angular/router";
import { LeafletService } from '../../services/leaflet.service';
import { isPlatformBrowser } from '@angular/common';
import { SEOService } from '../../services/seo.service';

@Component({
  selector: 'app-contact-us-page',
  templateUrl: './contact-us-page.component.html',
  styleUrls: ['./contact-us-page.component.css'],
  providers: [LeafletService]
})
export class ContactUsPageComponent implements OnInit {

  public server: string = environment.API_URL;
  public serverWs: string = environment.API_URL_WS;
  public informationHotelContact: any;
  public options: any;
  public layers: any;
  public establismentInformation: any;
  map: any;
  isBrowser: any;



  constructor(
    private _dataService: DataHomeService, private router: Router,
    private leafletService: LeafletService,
    private seoService: SEOService,
    private route: ActivatedRoute, @Inject(PLATFORM_ID) private platformId
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId)
  }

  ngOnInit() {
    this.getUrlParameters();
    let data = this.route.snapshot.data.resolveData;
    console.log('resolve data', data)
    this.seoService.updateTags({
      title: 'Contacto - Hotel Palermo Suite'
    })

  }

  getUrlParameters() {
    this.route.params.subscribe(params => {
      this.informationHotelSlug(params['hotelSlug']);
    });
  }


  public informationHotelSlug(slug) {

    this._dataService.getBySlug(slug).subscribe(
      response => {

        if (response['code'] == "NOFD_RECORD") {
          this.router.navigate(['/hotel/not-found']);
        } else {
          this.establismentInformation = response;
          this.informationHotel();
          this.seoService.updateTags({
            title: 'Contacto - ' + this.establismentInformation.name,
            description: this.establismentInformation.summary,
            image: this.establismentInformation.urlImage,
            url: this.seoService.getBaseUrl() + '/' + slug,
          })
        }

      },
      error => {
        this.router.navigate(['/hotel/not-found']);
        console.log(<any>error);

      }
    );
  }



  public informationHotel() {

    this._dataService.informationHotelCarrusel(this.establismentInformation.id).subscribe(
      response => {

        this.informationHotelContact = response;
        
        // if (response['latitude'] && response['longitude']) {
        //   this.options = {
        //     layers: [
        //       tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //         maxZoom: 18,
        //         attribution: 'Jirka'
        //       })
        //     ],
        //     zoom: 20,
        //     center: latLng(response['latitude'], response['longitude'])
        //   };

        //   this.layers = [
        //     marker([response['latitude'], response['longitude']], {
        //       icon: icon({
        //         iconSize: [30, 41],
        //         iconAnchor: [13, 41],
        //         iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png'
        //       })
        //     }).bindPopup('<p>' + response['name'] + '</p>' + '<p>' + response['commercialAddress'] + '</p>').openPopup()
        //   ];
        // }
        setTimeout(() => {
          if (this.leafletService.L) {
            // Leaflet is loaded - load the map!
            this.initMap(this.informationHotelContact);
          } else {
            // When the server renders it, it'll show this.
          }
        }, 4000);

      },
      error => {
        console.log(<any>error);

      }
    );
  }

  clickOnMap(ev) {
    console.log(ev)
  }

  private initMap(response): void {
    if (this.isBrowser) {
      // this.leafletService.L.map('map').setView([51.505, -0.09], 13);
      this.map = this.leafletService.L.map('map', {
        center: [response['latitude'], response['longitude']],
        zoom: 18,
        layers: [
          this.leafletService.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Jirka &copy; OpenStreetMap contributors'
          })
        ],
      });
      var marker = this.leafletService.L.marker([response['latitude'], response['longitude']], {
        icon: this.leafletService.L.icon({
          iconSize: [25, 41],
          iconAnchor: [13, 41],
          iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png'
        })
      }).addTo(this.map);
      marker.bindPopup('<p>' + response['name'] + '</p>' + '<p>' + response['commercialAddress'] + '</p>').openPopup()
    }

  }
}
