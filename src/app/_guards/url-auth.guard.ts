import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  ActivatedRoute
} from '@angular/router';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class UrlAuthGuard implements CanActivate {
  constructor(
    private router: Router, private route: ActivatedRoute
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      this.getUrlParameters();
    return true;

  }



  getUrlParameters() {
    this.route.params.subscribe(params => {


      //  this.informationHotelSlug(params['hotelSlug']);

    });
  }


}
