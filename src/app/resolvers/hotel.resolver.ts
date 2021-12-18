import { Injectable } from '@angular/core';

import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { DataHomeService } from '../services/data-home.service';

@Injectable()
export class HotelResolver implements Resolve<any> {
  constructor(private service: DataHomeService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> {
    return this.service.getSeo(route.paramMap.get('hotelSlug'))
  }
}