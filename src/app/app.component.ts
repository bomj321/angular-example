import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'delvatore-hotel';
  isBrowser: boolean;

   constructor(
      private router: Router,
      @Inject(PLATFORM_ID) private platformId)
    {
      this.isBrowser = isPlatformBrowser(this.platformId)

    }

    ngOnInit() 
    {

      /***Code for reload problematics js (Problems with Jquery)***/
         this.router.events.subscribe(event => {
              if (event instanceof NavigationEnd) {
                if(this.isBrowser ){
                  if (document.getElementById('custom_js') !=null) {
                      document.getElementById('custom_js').remove();
                  }
                  const node = document.createElement('script');                  
                  node.src = 'assets/js/js-by-files/problematics-scripts.js';                
                  node.type = 'text/javascript';
                  node.async = false;
                  node.id = 'custom_js';
                  node.charset = 'utf-8';
                  document.getElementsByTagName('head')[0].appendChild(node);
              }}
          });

      /***Code for reload problematics js (Problems with Jquery)***/
    }

   onActivate(event)
    {
      if(this.isBrowser)
      window.scroll(0,0);   
    }

}
