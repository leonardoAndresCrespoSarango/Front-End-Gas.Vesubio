import { Component, OnInit } from '@angular/core';
import { KeyValue } from '@angular/common';

import { MAT_COLORS } from '@shared';

@Component({
  selector: 'app-design-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss'],
})
export class DesignColorsComponent implements OnInit {
  colors: { key: string; value: any }[] = [];



  constructor() {}

  ngOnInit() {
    const colors: { [k: string]: any } = MAT_COLORS;
    for (const key of Object.keys(colors)) {
      this.colors.push({
        key,
        value: colors[key],
      });
    }
  }


}
