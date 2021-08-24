import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-img-loader',
  templateUrl: './img-loader.component.html',
  styleUrls: ['./img-loader.component.scss']
})
export class ImgLoaderComponent implements OnInit {
  @Input() source: string;
  @Output() imageClicked = new EventEmitter<any>();
  loading: boolean = true

  constructor() { }

  ngOnInit(): void {
  }

  onLoad() {
      this.loading = false;
  }

  imgClicked() {
    this.imageClicked.emit('clicked');
  }

}
