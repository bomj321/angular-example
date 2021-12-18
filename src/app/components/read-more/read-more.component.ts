import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-read-more',
  templateUrl: './read-more.component.html',
  styleUrls: ['./read-more.component.scss']
})
export class ReadMoreComponent implements OnChanges {
    @Input() text: string;
    @Input() more: string = 'Leer más';
    @Input() less: string = 'Ocultar';
    @Input() classNames: string = '';
    @Input() extendsOptions: any = false;
    fullText = true;
    showMore = false;
    showLess = false;
    rmTextShort = ''; 
    rmTextFull = ''; 
    inputWords = [];
    
    constructor() 
    {

      
    }

    readMore(flag) {
        if (flag) {
            this.showMore = false;
            this.fullText = true;
            this.rmTextFull = this.text;
            this.showLess = true;
        } else {
            this.showLess = false;
            this.showMore = true;
            this.fullText = false;
        }
    }

    ngOnChanges () {


        if(this.extendsOptions)
        {
            this.rmTextShort = this.text.trim();
            this.rmTextFull = this.text.trim();
            this.inputWords = this.text.trim().split(' ');    
     
                if (this.rmTextShort.length > 100) {
                    this.fullText = false;
                    this.showMore = true;
                    this.rmTextShort = this.rmTextShort.substr(0, 100) + '...'
                } else {
                    const lineBreaks = this.rmTextShort.split(/\n/g)
                    if (lineBreaks.length > 4) {
                        this.fullText = false
                        this.showMore = true
                        this.rmTextShort = lineBreaks.slice(0, 4).join('\n') + '...'
                    }
                }
        }else
        {
            this.rmTextShort = this.text.trim();
            this.rmTextFull = this.text.trim();
            this.inputWords = this.text.trim().split(' ');    
     
                if (this.rmTextShort.length > 200) {
                    this.fullText = false;
                    this.showMore = true;
                    this.rmTextShort = this.rmTextShort.substr(0, 200) + '...'
                } else {
                    const lineBreaks = this.rmTextShort.split(/\n/g)
                    if (lineBreaks.length > 4) {
                        this.fullText = false
                        this.showMore = true
                        this.rmTextShort = lineBreaks.slice(0, 4).join('\n') + '...'
                    }
                }
        }

      
        


    }
}