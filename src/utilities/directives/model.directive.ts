import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appModel]'
})
export class ModelDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) { }

  open() {
    this.viewContainer.createEmbeddedView(this.templateRef);
  }

  close() {
    this.viewContainer.clear();
  }

}
