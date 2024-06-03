import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Cancion } from '../../interfaces/cancion';
import { CancionService } from '../../services/cancion.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchQuery: string = '';
  searchResults: Cancion[] = [];

  constructor(private cancionService: CancionService, private router: Router) {}

  onSearch() {
    if (this.searchQuery.trim().length > 0) {
      this.cancionService.buscarCanciones(this.searchQuery).subscribe(
        (results) => {
          this.searchResults = results;
        },
        (error) => {
          console.error('Error fetching search results', error);
        }
      );
    } else {
      this.searchResults = [];
    }
  }

  navigateToSong(songId: number) {
    this.router.navigate([`/song/${songId}`]);
  }
}
