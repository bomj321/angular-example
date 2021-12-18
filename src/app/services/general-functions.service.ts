import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class GeneralFunctionsService {

  constructor(private toastr: ToastrService,) { }

  /****toastr notifications */

  notifications(message, type) {
    switch (type) {
      case 'success':
        this.toastr.success(message, 'Proceso exitoso.!');
        break;

      case 'error':

        this.toastr.error(message, 'Disculpe');
        break;

      case 'warning':

        this.toastr.warning(message, 'Un momento!');
        break;

      default:
        break;
    }
  }


  /****Add zero in date */


  public addZero(i) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }

  /****Verify if is number */

  isNumber(number) {

    if (isNaN(number)) {
      return false
    } else {
      if (number % 1 == 0) {
        return true;
      } else {
        return true;
      }
    }
  }

  formatDateDatePicker(date, separator) {

    var newDate = new Date(date);
    var dd = newDate.getDate();
    var mm = newDate.getMonth() + 1;
    var y = newDate.getFullYear();

    return this.addZero(dd) + separator + this.addZero(mm) + separator + this.addZero(y);
  }


  formatDateForApi(date, separator) {

    var newDate = new Date(date);
    var dd = newDate.getDate();
    var mm = newDate.getMonth() + 1;
    var y = newDate.getFullYear();

    return this.addZero(y) + separator + this.addZero(mm) + separator + this.addZero(dd);
  }

  removeTags(str) {
    if ((str === null) || (str === ''))
      return false;
    else
      str = str.toString();
    return str.replace(/(<([^>]+)>)/ig, '');
  }

  /******Prevent enter letters */


  keyPress(event: any) {
    const pattern = /^[0-9]*\.?[0-9]*$/;
    const inputChar = String.fromCharCode((event as KeyboardEvent).charCode);
    if (!pattern.test(inputChar)) {
      return false;
    }
  }

  keyPressSlug(event: any) {
    const pattern = /^[a-z0-9-]+$/;
    const inputChar = String.fromCharCode((event as KeyboardEvent).charCode);
    if (!pattern.test(inputChar)) {
      return false;
    }
  }


  keyPressWithOutIva(event: any) {
    const pattern = /^[1-9]*\.?[1-9]*$/;
    const inputChar = String.fromCharCode((event as KeyboardEvent).charCode);
    if (!pattern.test(inputChar)) {
      return false;
    }
  }



  verifyIfNullOrEmpty(param) {
    if (param == null || param == '' || param == 'undefined' || param == false) {
      return true
    } else {
      return false;
    }

  }

  eliminarObjetosDuplicados(arr, prop) {
    var nuevoArray = [];
    var lookup = {};

    for (var i in arr) {
      lookup[arr[i][prop]] = arr[i];
    }

    for (i in lookup) {
      nuevoArray.push(lookup[i]);
    }

    return nuevoArray;
  }




}
