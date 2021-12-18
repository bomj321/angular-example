import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-search-wrapper',
  templateUrl: './search-wrapper.component.html',
  styleUrls: ['./search-wrapper.component.css']
})
export class SearchWrapperComponent implements OnInit {

  @Input() establismentInformation = null;
  constructor() { }

  ngOnInit() {
  }

}
