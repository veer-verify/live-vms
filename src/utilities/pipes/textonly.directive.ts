import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTextonly]'
})
export class TextonlyDirective {

 constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Delete', 'Tab', 'Home', 'End'
    ];

    // Allow navigation keys and control keys
    if (allowedKeys.includes(event.key)) {
      return;
    }

    // Block if not a letter (A-Z or a-z)
    if (!/^[a-zA-Z]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  // Handle paste (in case user pastes invalid text)
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const pastedInput = event.clipboardData?.getData('text/plain') || '';
    if (!/^[a-zA-Z]+$/.test(pastedInput)) {
      event.preventDefault();
    }
  }

}
