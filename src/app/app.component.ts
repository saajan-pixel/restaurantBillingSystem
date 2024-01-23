import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'restaurantBillSystem';

  constructor(private meta: Meta) { }

  ngOnInit(): void {
    console.log("initial")
    const url = 'https://hrisstagefev2.ndplhrm.com/';
    const title = 'change Page Title';
    const description = 'chnage page description';
    const image = 'https://www.myhealthunlimited.com/wp-content/uploads/2016/07/300x200.png'
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ name: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: image });
  }
}
