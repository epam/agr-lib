import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, NgZone, OnDestroy, Output } from '@angular/core';

@Directive({
  selector: '[agrDragColumn]'
})
export class DragColumnDirective implements AfterViewInit, OnDestroy {
  @Input() set dragDisabled(value: boolean) {
    this.dragDisabled$ = value;
    this.dragDisabled$ ? this.unbindEvents() : this.bindEvents();
  }

  get dragDisabled(): boolean {
    return this.dragDisabled$;
  }

  @Output() dragStartEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() dropEvent: EventEmitter<any> = new EventEmitter<any>();

  dragStartListener: any;
  dropListener: any;
  private dragDisabled$ = false;

  constructor(public zone: NgZone,
              public elementRef: ElementRef) {
  }

  ngAfterViewInit(): void {
    this.dragDisabled$ ? this.unbindEvents() : this.bindEvents();
  }


  ngOnDestroy(): void {
    this.unbindEvents();
  }


  private onDragStart($event:unknown) {
    this.dragStartEvent.emit($event);
  }

  private onDrop($event:unknown) {
    this.dropEvent.emit($event);
  }

  private bindEvents() {
    this.zone.runOutsideAngular(() => {
      this.dragStartListener = this.onDragStart.bind(this);
      this.elementRef.nativeElement.addEventListener('dragstart', this.dragStartListener);
      this.dropListener = this.onDrop.bind(this);
      this.elementRef.nativeElement.addEventListener('drop', this.dropListener);
    });

  }

  private unbindEvents() {
    if (this.dragStartListener) {
      this.elementRef.nativeElement.removeEventListener('dragstart', this.dragStartListener);
      this.dragStartListener = null;
    }
    if (this.dropListener) {
      this.elementRef.nativeElement.removeEventListener('drop', this.dropListener);
      this.dropListener = null;
    }
  }


}
