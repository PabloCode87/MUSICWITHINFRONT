import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  @Input() title: string = 'MusicWithinFront';

  getCurrentYear(): number {
    return new Date().getFullYear();
  }
}
