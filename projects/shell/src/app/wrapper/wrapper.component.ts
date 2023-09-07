import { Component, ElementRef, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { loadRemoteModule } from '@softarc/native-federation-runtime';
import { initWrapperConfig } from './wrapper-config';

@Component({
  selector: 'app-wrapper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.css']
})
export class WrapperComponent implements OnInit {
  elm = inject(ElementRef);

  @Input() config = initWrapperConfig;

  showPlaceholder = true;

  async ngOnInit() {
    const options: IntersectionObserverInit = {
      root: null,
      threshold: 0.75,
    };

    const io = new IntersectionObserver((e) => {
      if (e[0].isIntersecting && this.showPlaceholder) {
        this.loadComponent();
        this.showPlaceholder = false;
      }
    }, options);

    io.observe(this.elm.nativeElement);
  }

  async loadComponent() {
    const { exposedModule, remoteName, elementName } = this.config;

    await loadRemoteModule(remoteName, exposedModule);
    const root = document.createElement(elementName);
    this.elm.nativeElement.appendChild(root);
  }

}
