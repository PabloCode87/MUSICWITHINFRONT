import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Music Within';
  audioUrl: string | null = null;

  constructor (){}

  ngOnInit():void{
    
  }

  
}
0