import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-preview-card',
  templateUrl: './preview-card.component.html',
  styleUrls: ['./preview-card.component.scss']
})
export class PreviewCardComponent implements OnInit {
  @Input() file: any

  url;

  constructor() { }

  ngOnInit(): void {
    this.readFile(this.file)
  }

  isFileAnImage() {
    return this.file.type.startsWith("image")
  }

  readFile(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file); // read file as data url

    reader.onload = (event) => { // called once readAsDataURL is completed
      this.url = event.target.result;
    }
  }

}
