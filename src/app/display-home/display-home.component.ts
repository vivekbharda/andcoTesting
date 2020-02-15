import { Component, OnInit } from '@angular/core';
declare var $;

@Component({
  selector: 'app-display-home',
  templateUrl: './display-home.component.html',
  styleUrls: ['./display-home.component.css']
})
export class DisplayHomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {

     //display screen slider start
    this.initSlickclider()
    //display screen slider end
    
  }
  initSlickclider(){
    $('.display-screen-slider').not('.slick-initialized').slick({
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 1500,
      arrows:false,
      verticalSwiping: true,
      vertical: true,
  });
  }
}
