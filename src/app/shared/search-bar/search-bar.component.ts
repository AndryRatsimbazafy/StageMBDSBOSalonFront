import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { } from 'events';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  @Input() public searchInside: Observable<any>;
  @Input() public searchBy: string;
  @Input() public placeHolder: string;


  @Output() filteredData = new EventEmitter<Observable<any>>();

  searchInput: FormControl;
  searchInputChange$: Observable<string>;
  result$: Observable<any>;
  constructor() { }

  ngOnInit(): void {
    // console.log('searchInside...', this.searchInside);
    // console.log('init search....');
    this.searchInput = new FormControl('');
    this.searchInputChange$ = this.searchInput.valueChanges.pipe(startWith(''));
    this.result$ = combineLatest(this.searchInside, this.searchInputChange$).pipe(
      map(([lists, filterString]) => {
        return lists.filter(
          (list) => {
            switch (this.searchBy) {
              case 'name':
                if (list.user_id && list.user_id.companyName) {
                  return list.user_id.companyName.toLowerCase().indexOf(filterString.toLowerCase()) !== -1;
                }
                break;
              case 'email':
                if (list.email) { return list.email.toLowerCase().indexOf(filterString.toLowerCase()) !== -1; }
                break;
              case 'role' : 
              if (list.role) { return list.role.toLowerCase().indexOf(filterString.toLowerCase()) !== -1; }
                break;
            }
          }

        );
      })
    );
    this.filteredData.emit(this.result$);
  }

}
