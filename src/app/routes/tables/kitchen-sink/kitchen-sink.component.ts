import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { TranslateService } from '@ngx-translate/core';
import { TablesDataService } from '../data.service';
import { TablesKitchenSinkEditComponent } from './edit/edit.component';
import {RegValueService} from "../../../../service/reg-value.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {catchError} from "rxjs/operators";
import {NgxFileDropEntry} from "ngx-file-drop";

@Component({
  selector: 'app-table-kitchen-sink',
  templateUrl: './kitchen-sink.component.html',
  styleUrls: ['./kitchen-sink.component.scss'],
  providers: [TablesDataService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablesKitchenSinkComponent implements OnInit {
  selectedFile: File | null = null;
  constructor(
    private httpClient: HttpClient,
    private regValueService: RegValueService
  ) {}
  ngOnInit() {
  }
  /*onFileDropped($event: File[]) {
    const selectedFile: File = $event[0];

    if (!selectedFile) {
      console.error('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    console.log('File name:', selectedFile.name);
    console.log('File extension:', selectedFile.name.split('.').pop());

    const headers = new HttpHeaders({
      'enctype': 'multipart/form-data' // Configura el encabezado adecuadamente
    });

    this.httpClient.post('http://localhost:8080/values/Import', formData, { headers }).subscribe(
      response => {
        console.log('File uploaded successfully:', response);
      },
      error => {
        console.error('Error uploading file:', error);
      }
    );
  }*/
  onFileDropped(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.handleFile(file);
        });
      }
    }
  }

  handleFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    console.log('File name:', file.name);
    console.log('File extension:', file.name.split('.').pop());

    const headers = new HttpHeaders({
      'enctype': 'multipart/form-data' // Configura el encabezado adecuadamente
    });

    this.httpClient.post('http://localhost:8080/values/Import', formData, { headers }).subscribe(
      response => {
        console.log('File uploaded successfully:', response);
      },
      error => {
        console.error('Error uploading file:', error);
      }
    );
  }

}
