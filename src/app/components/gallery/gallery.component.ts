import { ReservationService } from '../../services/reservation.service';
import { environment } from '../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataHomeService } from '../../services/data-home.service';
import { Lightbox } from 'ngx-lightbox';
import { HttpParams } from '@angular/common/http';
import { SEOService } from '../../services/seo.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
  providers: [ReservationService, DataHomeService]
})
export class GalleryComponent implements OnInit {

  /****************Variables for pagination********************/
  public pageSize: number;
  public page: number;

  /****************Variables for pagination********************/

  /**************Other variables****************/
  public server: string = environment.API_URL;
  public informationsOurRoomSection: any;
  public informationOurOffers: any;
  public photos: any;
  public photosGallery: any = [];
  public photosPageable: any = [];

  public establismentInformation: any;
  /**************Other variables****************/
  public loading: any = true;

  constructor(
    private _dataReservationService: ReservationService,
    private _dataService: DataHomeService,
    private router: Router,
    private route: ActivatedRoute,
    private _http: HttpClient,
    private _lightbox: Lightbox,
    private seoService: SEOService
    //private offersService : OffersService
  ) {
    this.pageSize = 5;
    this.page = 1;
  }

  ngOnInit() {
    let data = this.route.snapshot.data.resolveData;
    console.log('resolve data', data)

    this.seoService.updateTags({
      title: 'Galeria - Hotel Palermo Suite'
    })
    this.getUrlParameters();
  }

  getUrlParameters() {
    this.route.params.subscribe(params => {
      this.informationHotelSlug(params['hotelSlug']);
    });
  }


  public informationHotelSlug(slug) {

    this.loading = true;
    this._dataService.getBySlug(slug).subscribe(
      response => {

        if (response['code'] == "NOFD_RECORD") {
          this.router.navigate(['/hotel/not-found']);
        } else {
          this.establismentInformation = response;
          this.seoService.updateTags({
            title: 'Galeria - ' + this.establismentInformation.name,
            description: this.establismentInformation.summary,
            image: this.establismentInformation.urlImage,
            url: this.seoService.getBaseUrl() + '/' + slug,
          })
          this.imageGallery();
        }
      },
      error => {
        this.router.navigate(['/hotel/not-found']);
        console.log(<any>error);
        this.loading = false;

      }
    );
  }



  public imageGallery(page = 1) {

    if (this.photos) {
      if (this.photos.totalElements == this.photosPageable.length) {
        return false;
      }

    }


    this.loading = true;
    let params = new HttpParams();
    params = params.append('page', String(page - 1));
    params = params.append("showRows", String(6));
    params = params.append("state", String(1));
    this._dataService.imageGallery(this.establismentInformation.id, params).subscribe(
      response => {


        if (page == 1) {
          this.photos = response;
        }

        if (response.empty == false) {
          response.content.forEach(element => {
            this.photosPageable.push(element);
          });


          response.content.forEach(element => {
            this.photosGallery.push({
              src: this.server + element.urlImage,
              caption: element.name + ' - ' + element.description,
              thumb: this.server + element.urlImage
            });
          });
        }

        this.loading = false;
      },
      error => {
        console.log(<any>error);
        this.loading = false;

      }
    );
  }

  onScroll() {
    this.imageGallery(this.page = this.page + 1);
  }

  open(index: number): void {
    // open lightbox
    this._lightbox.open(this.photosGallery, index, {
      fadeDuration: 0.2,
      centerVertically: true,
      disableScrolling: true
    });
  }

  close(): void {
    this._lightbox.close();
  }

}
