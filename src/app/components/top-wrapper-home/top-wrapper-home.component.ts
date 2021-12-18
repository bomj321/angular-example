import {
  Component,
  OnInit,
  Injectable,
  Input,
  Output,
  EventEmitter, Inject, PLATFORM_ID
} from "@angular/core";
import { Router, ActivatedRoute, RouterLinkActive } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { TranslationLoaderService } from "../../services/translation-loader.service";
import { locale as english } from "../../services/i18n/en";
import { locale as spanish } from "../../services/i18n/es";
import { environment } from "../../../environments/environment";
import { DataHomeService } from "../../services/data-home.service";
import { HttpParams } from "@angular/common/http";
import { GeneralFunctionsService } from '../../services/general-functions.service'

import * as _ from "lodash";
import { isPlatformBrowser } from '@angular/common';
declare var jQuery: any;
declare var $: any;
@Component({
  selector: "app-top-wrapper-home",
  templateUrl: "./top-wrapper-home.component.html",
  styleUrls: ["./top-wrapper-home.component.css"],
  providers: [DataHomeService],
})
export class TopWrapperHomeComponent implements OnInit {
  @Input() establismentInformation = null;
  public server: string = environment.API_URL;
  public serverWs: string = environment.API_URL_WS;

  /*********************i18n*************************/
  public languages: any;
  public selectedLanguage: any;

  public informationHotelCarrusel: any;
  public sectionHidden: any = [];
  isBrowser: boolean;
  /*********************i18n*************************/
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _translateService: TranslateService,
    private _translationLoaderService: TranslationLoaderService,
    private _dataService: DataHomeService,
    private generalFunctionsService: GeneralFunctionsService, @Inject(PLATFORM_ID) private platformId) {
    this.isBrowser = isPlatformBrowser(this.platformId)
    // Add languages
    this._translateService.addLangs(["en", "es"]);
    // Set the default language
    this._translateService.setDefaultLang("es");
    // Use a language
    this._translateService.use("es");

    this.languages = [
      {
        id: "en",
        title: "English (EN)",
        flag: "en",
      },
      {
        id: "es",
        title: "Español (ES)",
        flag: "es",
      },
    ];

    this._translationLoaderService.loadTranslations(english, spanish);
  }

  ngOnInit() {
    this.selectedLanguage = _.find(this.languages, {
      id: this._translateService.currentLang,
    });
    this.informationHotel();
    this.aboutUsSection();
    this.informationOurRooms();
    this.informationBestPlaces();
    this.getGallery();
    this.getServices();
    this.getPromotions();
  }

  public informationHotel() {
    this._dataService
      .informationHotelCarrusel(this.establismentInformation.id)
      .subscribe(
        (response) => {
          console.log('RESPONSE', response);
          this.informationHotelCarrusel = response;
        },
        (error) => {
          console.log(<any>error);
        }
      );
  }

  setLanguage(lang): void {
    // Set the selected language for the toolbar
    this.selectedLanguage = lang;

    // Use the selected language for translations
    this._translateService.use(lang.id);
    setTimeout(function () {
      if (this.isBrowser) {
        $(".select2").select2({
          minimumResultsForSearch: Infinity,
        });
      }
    }, 800);
  }

  /********APIs verify**** */

  public aboutUsSection() {
    this._dataService
      .aboutSectionCarousel(this.establismentInformation.id)
      .subscribe(
        (response) => {
          if (
            response.length > 0 ||
            this.establismentInformation.mainServices.length > 0 ||
            this.establismentInformation.otherServices.length > 0 ||
            this.establismentInformation.certifications.length > 0
          ) {
            this.sectionHidden["aboutUs"] = true;
          } else {
            this.sectionHidden["aboutUs"] = false;
          }
        },
        (error) => {
          console.log(<any>error);
        }
      );
  }

  public informationOurRooms() {
    this._dataService
      .informationOurRoomsHome(this.establismentInformation.id)
      .subscribe(
        (response) => {
          if (response.filter(response => response.pricePerNight != null).length > 0) {
            this.sectionHidden["rooms"] = true;
          } else {
            this.sectionHidden["rooms"] = false;
          }
        },
        (error) => {
          console.log(<any>error);
        }
      );
  }

  public informationBestPlaces() {
    this._dataService
      .informationBestPlaces(this.establismentInformation.id)
      .subscribe(
        (response) => {
          if (response.destinations.length > 0) {
            this.sectionHidden["places"] = true;
          } else {
            this.sectionHidden["places"] = false;
          }
        },
        (error) => {
          console.log(<any>error);
        }
      );
  }

  public getGallery() {
    this._dataService.imageCarrusel(this.establismentInformation.id).subscribe(
      (response) => {
        if (response.length > 0) {
          this.sectionHidden["gallery"] = true;
        } else {
          this.sectionHidden["gallery"] = false;
        }
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }

  public getServices() {
    let params = new HttpParams();
    params = params.append("state", String(1));
    this._dataService
      .informationCustomizedService(this.establismentInformation.id, params)
      .subscribe(
        (response) => {
          if (!response.empty) {
            this.sectionHidden["services"] = true;
          } else {
            this.sectionHidden["services"] = false;
          }
        },
        (error) => {
          console.log(<any>error);
        }
      );
  }

  public getPromotions() {

    var startDate = new Date()
    var finishDate = new Date()
    finishDate.setMonth(finishDate.getMonth() + 6)

    let params = new HttpParams();
    params = params.append("startDateParam", String(startDate.getFullYear() + "-" + (this.generalFunctionsService.addZero(startDate.getMonth() + 1)) + "-" + this.generalFunctionsService.addZero(startDate.getDate())));
    params = params.append("finishDateParam", String(finishDate.getFullYear() + "-" + (this.generalFunctionsService.addZero(finishDate.getMonth() + 1)) + "-" + this.generalFunctionsService.addZero(finishDate.getDate())));
    params = params.append("affiliateIdParam", String(this.establismentInformation.id));
    this._dataService
      .getPromotionsHotel(params)
      .subscribe(
        (response: any[]) => {

          if (response.length > 0) {
            this.sectionHidden["promotions"] = true;
          } else {
            this.sectionHidden["promotions"] = false;
          }
        },
        (error) => {
          console.log(<any>error);
        }
      );
  }
}
