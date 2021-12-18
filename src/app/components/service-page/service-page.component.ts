import { environment } from "../../../environments/environment";
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DataHomeService } from "../../services/data-home.service";
import { Lightbox } from "ngx-lightbox";
import { HttpParams } from "@angular/common/http";
import { SEOService } from '../../services/seo.service';

@Component({
  selector: "app-service-page",
  templateUrl: "./service-page.component.html",
  styleUrls: ["./service-page.component.scss"],
})
export class ServicePageComponent implements OnInit {
  /****************Variables for pagination********************/
  public pageSize: number;
  public page: number;

  /****************Variables for pagination********************/

  /**************Other variables****************/
  public server: string = environment.API_URL;
  public informationsOurRoomSection: any;
  public informationOurOffers: any;
  public services: any;
  public servicesPageable: any = [];

  public establismentInformation: any;
  /**************Other variables****************/
  public loading: any = true;

  constructor(
    private _dataService: DataHomeService,
    private router: Router,
    private route: ActivatedRoute,
    private _http: HttpClient,
    private seoService: SEOService,
    private _lightbox: Lightbox //private offersService : OffersService
  ) {
    this.pageSize = 5;
    this.page = 1;
  }

  ngOnInit() {
    this.getUrlParameters();
    this.seoService.updateTags({
      title: 'Servicios - Hotel Palermo Suite'
    })
  }

  getUrlParameters() {
    this.route.params.subscribe((params) => {
      this.informationServiceSlug(params["hotelSlug"]);
    });
  }

  public informationServiceSlug(slug) {
    this.loading = true;
    this._dataService.getBySlug(slug).subscribe(
      (response) => {
        if (response["code"] == "NOFD_RECORD") {
          this.router.navigate(["/hotel/not-found"]);
        } else {
          this.establismentInformation = response;
          this.seoService.updateTags({
            title: 'Servicios - ' + this.establismentInformation.name,
            description: this.establismentInformation.summary,
            image: this.establismentInformation.urlImage,
            url: this.seoService.getBaseUrl() + '/' + slug,
          })
          this.service(this.page);
        }

      },
      (error) => {
        this.router.navigate(["/hotel/not-found"]);
        console.log(<any>error);
        this.loading = false;
      }
    );
  }

  public service(page = 1) {
    if (this.services) {

      if (this.services.totalElements == this.servicesPageable.length) {
        return false;
      }

    }

    this.loading = true;
    let params = new HttpParams();
    params = params.append('page', String(page - 1));
    params = params.append("showRows", String(4));
    params = params.append("state", String(1));

    this._dataService
      .informationCustomizedService(this.establismentInformation.id, params)
      .subscribe(
        (response) => {

          if (page == 1) {
            this.services = response;
          }

          if (response.empty == false) {
            response.content.forEach(element => {
              this.servicesPageable.push(element);
            });
          }
          this.loading = false;
        },
        (error) => {
          console.log(<any>error);
          this.loading = false;
        }
      );


  }

  onScroll() {
    this.service(this.page = this.page + 1);
  }
}
