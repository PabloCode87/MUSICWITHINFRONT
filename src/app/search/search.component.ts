import { Component } from '@angular/core';
import { Cancion } from '../interfaces/cancion';
import { CancionService } from '../services/cancion.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  songName: string = '';
  artist: string = '';
  searchTerm: string = '';
  searchResults: Cancion[] = [];
  showDropdown: boolean = false;

  constructor(private cancionService: CancionService) {}

  onInput(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value.trim();
    
    this.cancionService.buscarCanciones(inputValue).subscribe(
      (resultados: Cancion[]) => {
        this.searchResults = resultados;
        this.showDropdown = true; // Show dropdown when there are results
      },
      (error) => {
        console.error('Error al buscar canciones:', error);
        this.searchResults = [];
        this.showDropdown = false;
      }
    );
  }

  onSelectResult(cancion: Cancion): void {
    this.searchTerm = '';
    this.showDropdown = false;
    window.location.href = `/cancion/${cancion.songID}`;
  }
}
