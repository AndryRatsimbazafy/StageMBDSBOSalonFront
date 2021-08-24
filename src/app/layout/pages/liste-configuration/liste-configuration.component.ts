import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { RoomEntry } from 'src/app/core/schema/room.shema';
import { getAllRoomsRequested } from 'src/app/core/store/room/room.action';
import {
  selectAllRooms,
  selectRoomLoading,
} from 'src/app/core/store/room/room.selector';

@Component({
  selector: 'app-liste-configuration',
  templateUrl: './liste-configuration.component.html',
  styleUrls: ['./liste-configuration.component.scss'],
})
export class ListeConfigurationComponent implements OnInit, OnDestroy {
  rooms$: Observable<RoomEntry[]>;
  isLoading$: Observable<boolean>;

  unsubscribeAll: Subject<boolean>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  displayedColumns: string[] = [
    'societe',
    'couleur',
    'surface',
    'variante',
    'mobiliers',
    'personnages',
  ];

  dataSource: MatTableDataSource<any>;

  constructor(private store: Store) {
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(selectRoomLoading);
    this.loadAllRooms();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  loadAllRooms(): void {
    this.store.dispatch(getAllRoomsRequested());
    this.rooms$ = this.store.select(selectAllRooms);
  }

  getFilteredData(data): void {
    data
      .pipe(
        map((res: any) => {
          return res.map((room: RoomEntry) => {
            let personnageName = [];
            let processedVariante;
            let processedMob;

            // get personnage name from personnages
            personnageName = room.characters.map((pers) => pers.name);
            personnageName.sort((a, b) => {
              let c = +a.split(' ')[1];
              let d = +b.split(' ')[1];
              return c - d;
            });

            // remove surface Name and mob name from variante nam
            if (room.type) {
              const regex = new RegExp(room.type.name, 'i');
              processedVariante = room.variant.name.replace(regex, '');
              processedMob = room.mob.name.replace(regex, '');
            }

            return { ...room, personnageName, processedVariante, processedMob };
          });
        }),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe((entries) => {
        this.dataSource = new MatTableDataSource<RoomEntry>(entries);
        this.dataSource.paginator = this.paginator;
      });
  }
}
