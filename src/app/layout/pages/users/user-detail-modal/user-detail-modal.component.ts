import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AccountEntry} from '../../../../@core/schema/account.schema';
import {Workbook} from 'exceljs';
import * as fs from 'file-saver';
import * as _ from 'lodash';

@Component({
  selector: 'app-user-detail-modal',
  templateUrl: './user-detail-modal.component.html',
  styleUrls: ['./user-detail-modal.component.scss']
})
export class UserDetailModalComponent implements OnInit {

  lodash = _;

  newData
  constructor(@Inject(MAT_DIALOG_DATA) public data: AccountEntry) { }

  ngOnInit(): void {
    console.log(this.data);
    this.newData = {
      ...this.data,
      coachingDate: this.data?.coachings?.coachingDate,
      coachingHour: this.data?.coachings?.coachingHour
    }

  }

  addHeader(column, row, value, workSheet): any {
    const cell = `${column}${row}`;
    const rowEntry = workSheet.getCell(cell);
    rowEntry.value = value;
  }

  exportExcel(): void {
    // Create a workbook with a worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('salon');

    worksheet.getColumn('A').width = 50;

    const entries = ['firstName', 'lastName', 'email', 'phoneNumber', 'postalCode', 'projects', 'conferences', 'coachingDate','coachingHour',  'regReason'];
    const mapping = {
      firstName: 'Nom',
      lastName: 'Prénom',
      email: 'Email',
      phoneNumber: 'Téléphone',
      postalCode: 'Code postal',
      projects: 'Projets',
      conferences: 'Conférence',
      coachingDate: 'coachingDate',
      coachingHour: 'coachingHour',
      regReason: 'Raison de votre visite'
    };

    for (const key of entries) {
      if (mapping[key]) {
        if (!_.isEmpty(this.newData[key])) {
          const row = worksheet.addRow([mapping[key]]);
          row.font = {
            bold: true
          };
          row.alignment = {
            vertical: 'middle'
          }
          row.height = 25;
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
              argb: 'FFE4E4E4'
            }
          };
          if (typeof this.newData[key] === 'object') {
            for (const el of this.newData[key]) {
              const elRow = worksheet.addRow([el]);
              elRow.alignment = { vertical: 'middle' };
              elRow.height = 25;
            }
          } else {
            const elRow = worksheet.addRow([this.newData[key]]);
            elRow.alignment = { vertical: 'middle' };
            elRow.height = 25;
          }
        }
      }
    }

    /* save to file */
    const fileName = `${this.data.firstName}-${this.data.lastName}.xlsx`;
    // Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName);
    });
  }

}
