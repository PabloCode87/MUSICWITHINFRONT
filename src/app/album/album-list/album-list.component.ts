import { Component, OnInit } from '@angular/core';
import { Album } from '../../interfaces/album';
import { AlbumService } from '../../services/album.service';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrl: './album-list.component.css'
})
export class AlbumListComponent implements OnInit {

  albums ?:Album[];
  title :string='Lista de Albumnes';

  constructor (private albumService: AlbumService){}

  ngOnInit(): void {
    this.getAlbums();
  }

  getAlbums(): void{
    this.albumService.getAllAlbums().subscribe(albums=> this.albums=albums);
  }

}
