import {Injectable, Inject, PLATFORM_ID} from '@angular/core'; 
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class SEOService {

  /**
   * @property Valor por defecto
   */
  private default: seoData = {
    title: 'Hotel Palermo Suite',
    description: 'Hotel en Pasto para ejecutivos y turistas. Contamos con WIFI alta velocidad, desayuno gratuito, ubicado en zona residencial',
    url: 'https://hotelpalermopasto.com/palermos',
    image: 'https://www.cotelco.org:9090/jpms-gateway/ms-jpms/public/hotels/image/696/2949fce4-4a66-40da-ae2b-b87d95d09bed.jpg',
    keywords: 'hoteles, colombia, hoteles en Colombia, hoteles en Bogotá, hoteles en Cartagena, Hoteles en San Andrés, Hoteles en Medellín, Hoteles en Santa Marta, Hoteles en Barranquilla, Dónde hospedarse en Colombia, Reservas de hoteles, hoteles económicos, hoteles baratos, hostales en Colombia, apartahotel en Colombia'
  }
  private twitterUser = '@Cotelcolombia'
  constructor(
    private title: Title,
    private meta: Meta,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId
  ) { }

  getBaseUrl() {
    if (isPlatformBrowser(this.platformId))
    {
      return location.origin
    }else{
      return this.default.url
    }
  }
  getFullUrl() {
    if (isPlatformBrowser(this.platformId))
    {
      return location.href
    }else{
      return this.default.url
    }
  }

  updateTags(data: seoData) {
    let title = data.title ? data.title : this.default.title
    let description = data.description ? data.description : this.default.description
    let image = data.image ? data.image : this.default.image
    let url = data.url ? data.url : this.default.url
    let keywords = data.keywords ? data.keywords : this.default.keywords

    this.title.setTitle(title);
    this.meta.updateTag({name: 'description', content: description});
    this.meta.updateTag({name: "keywords", content: keywords});

    this.meta.addTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.addTag({ name: 'twitter:site', content: this.twitterUser });
    this.meta.addTag({ name: 'twitter:title', content: title });
    this.meta.addTag({ name: 'twitter:description', content: description });
    this.meta.addTag({ name: 'twitter:image', content: image });

    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: image });
  }

  removeTags() {
    this.meta.removeTag('name=\'twitter:card\'')
  }

  setDefault() {
    this.updateTags(this.default)
  }

  getSeo(slug): Observable<any> {
    return this.http.get('https://www.cotelco.org:9090/jpms-gateway/ms-jpms/public/hotels/seo/'+slug)
  }

}

type seoData = {
  title: string,
  description?: string,
  url?: string,
  image?: string,
  keywords?: string
}