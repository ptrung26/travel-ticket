import { Directive, Input, ElementRef, HostListener, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

@Directive({
    selector: '[dirTeleport]'
})
export class TeleportDirective implements OnInit, OnDestroy {
    @Input('to') targetElementSelector: string; // Target element selector to teleport to
    @Output("clickOutSide") clickOutSide = new EventEmitter();
    private elementToTeleport: HTMLElement;
    private parentElement: HTMLElement;

    constructor(private elementRef: ElementRef) { }

    ngOnInit() {
        this.elementToTeleport = this.elementRef.nativeElement;
        this.parentElement = this.elementToTeleport.parentElement;
        const targetElement = this.targetElementSelector ? document.querySelector(this.targetElementSelector) : document.body;
        targetElement.appendChild(this.elementToTeleport);
        this.positionElement();
    }

    ngOnDestroy() {
        if (this.elementToTeleport) {
            this.elementToTeleport.remove();
        }
    }

    @HostListener('document:click', ['$event'])
    onClick(event: MouseEvent) {
        const clickedElement = event.target as HTMLElement;
        const isClickedInsideDropdown = this.elementToTeleport.contains(clickedElement);
        if (!this.parentElement.contains(clickedElement) && !isClickedInsideDropdown) {
            this.clickOutSide.emit();
        }
    }


    @HostListener('window:resize')
    onWindowResize() {
        this.positionElement();
    }

    private positionElement() {
        const parentRect = this.parentElement.getBoundingClientRect();
        this.elementToTeleport.style.position = 'absolute';
        this.elementToTeleport.style.top = (parentRect.top + parentRect.height) + 'px';
        this.elementToTeleport.style.left = parentRect.left + 'px';
    }

}
