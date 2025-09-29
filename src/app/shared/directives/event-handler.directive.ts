import {
  Directive,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';

@Directive({
  selector: '[appEventHandler]',
  standalone: true,
})
export class EventHandlerDirective implements OnInit, OnDestroy {
  @Input('appEventHandler') fieldConfig: any;
  @Output() onEvent = new EventEmitter<{ action: string; payload: Event }>();
  private readonly unlistenFunctions: (() => void)[] = [];
  constructor(private readonly elementRef: ElementRef) {}
  ngOnInit(): void {
    if (this.fieldConfig?.events) {
      for (const eventConfig of this.fieldConfig.events) {
        const listener = (event: Event) => {
          this.onEvent.emit({ action: eventConfig.action, payload: event });
        };
        this.elementRef.nativeElement.addEventListener(
          eventConfig.name,
          listener
        );
        this.unlistenFunctions.push(() => {
          this.elementRef.nativeElement.removeEventListener(
            eventConfig.name,
            listener
          );
        });
      }
    }
  }
  ngOnDestroy(): void {
    this.unlistenFunctions.forEach((unlisten) => unlisten());
  }
}
