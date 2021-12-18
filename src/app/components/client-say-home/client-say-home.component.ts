import { Component, OnInit, Injectable, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-client-say-home',
  templateUrl: './client-say-home.component.html',
  styleUrls: ['./client-say-home.component.css']
})
export class ClientSayHomeComponent implements OnInit {

  @Input() establismentInformation = null;

  constructor() { }

  ngOnInit() {
  }

}
