import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { DataHomeService } from '../../services/data-home.service';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { ServicesModalComponent } from '../../modales/services-modal/services-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SEOService } from '../../services/seo.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
declare var jQuery: any;
declare var $: any;


@Component({
  selector: 'app-about-us-page',
  templateUrl: './about-us-page.component.html',
  styleUrls: ['./about-us-page.component.css']
})
export class AboutUsPageComponent implements OnInit {

  public server: string = environment.API_URL;
  public imageArrayCarrusel: any[] = [];
  public hotelInformation: any = [];
  public establismentInformation: any;
  public loading: any;
  public certificationsHotel: any;

  public customOptions: OwlOptions = {
    autoplay: true,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    items: 1,
    navSpeed: 700,
    navText: [`<i class='fa fa-chevron-circle-left' aria-hidden='true'></i>`, `<i class='fa fa-chevron-circle-right' aria-hidden='true'></i>`],
    nav: true
  }

  public customOptionsServices: OwlOptions = {
    autoplay: true,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    items: 4,
    navSpeed: 700,
    //navText: [ `<i class='fa fa-chevron-circle-left' aria-hidden='true'></i>`, `<i class='fa fa-chevron-circle-right' aria-hidden='true'></i>`],   
    nav: false
  }

  constructor(private _dataService: DataHomeService,
    private router: Router,
    private modal: NgbModal,
    private route: ActivatedRoute,
    private seoService: SEOService,
    private http: HttpClient,
    private toastr: ToastrService) { }


  ngOnInit() {
    this.getUrlParameters();
    let resp = this.route.snapshot.data.resolveData;
    this.seoService.updateTags({
      title: 'Nosotros - ' + resp.title,
      description: resp.description,
      image: 'https://www.cotelco.org:9090/jpms-gateway/ms-jpms'+resp.urlImage,
      url: this.seoService.getBaseUrl() + '/' + resp.token,
    })
    console.log(resp,'data')
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
          
          this.informationHotel();
        }
      },
      error => {
        this.router.navigate(['/hotel/not-found']);
        this.loading = false;


      }
    );
  }

  public imageCarrusel() {
    this.loading = true;

    this._dataService.aboutSectionCarousel(this.establismentInformation.id).subscribe(
      response => {
        this.imageArrayCarrusel = response;
        this.loading = false;

      },
      error => {
        this.loading = false;


      }
    );
  }


  public informationHotel() {
    this.loading = true;

    this._dataService.informationHotelCarrusel(this.establismentInformation.id).subscribe(
      response => {

        this.hotelInformation = response;
        this.imageCarrusel();

      },
      error => {
        console.log(<any>error);
        this.loading = false;


      }
    );
  }

  openModalPlace(establismentInformation) {
    const modal = this.modal.open(ServicesModalComponent, { size: 'lg', backdrop: 'static' });
    modal.componentInstance.establismentInformation = establismentInformation;

  }

}
