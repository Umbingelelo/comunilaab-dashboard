import { Component, Input, OnInit } from '@angular/core';
import { faChevronCircleLeft, faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-component-carousel',
  templateUrl: './component-carousel.component.html',
  styleUrls: ['./component-carousel.component.css']
})
export class ComponentCarouselComponent implements OnInit {

  public carouselHeader: any = 0;
  public isMobile = window.innerWidth < 768;
  public faChevronCircleLeft = faChevronCircleLeft;
  public faChevronCircleRight = faChevronCircleRight;
  public cardToShow: any;
  @Input() carouselCards: any;
  @Input() chartType: any;


  ngOnInit() {
    this.setCardsToShow();
  }

  setCardsToShow() {
    if (!this.isMobile) {
      this.cardToShow = this.carouselCards.filter((card: any) => {
        return card.state === true;
      });
    } else {
      this.cardToShow = this.carouselCards;
    }
  }

  carouselLeft() {
    this.carouselHeader -= 1;
    if (this.carouselHeader < 0) this.carouselHeader = this.carouselCards.length - 1;
    this.setCarouselState();
  }

  carouselRight() {
    this.carouselHeader = (this.carouselHeader + 1) % this.carouselCards.length;
    this.setCarouselState();
  }

  setCarouselState() {
    this.carouselCards.forEach((card: any, index: any) => {
      if (index === this.carouselHeader) {
        card.state = true;
      } else {
        card.state = false;
      }
    });
    this.setCardsToShow();
  }
}
