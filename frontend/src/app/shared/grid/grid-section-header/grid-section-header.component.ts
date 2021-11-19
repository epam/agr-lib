import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'agr-grid-section-header',
  templateUrl: './grid-section-header.component.html',
  styleUrls: ['./grid-section-header.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class GridSectionHeaderComponent implements OnInit {
  @Input() title:string;
  @Input() collapsible:boolean;
  @Input() collapsed:boolean;
  @Input() pin:boolean;
  @Input() pinned:boolean;
  @Output() collapse = new EventEmitter<boolean>();
  @Output() pinChange = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit(): void {
  }

}
