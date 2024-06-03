import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Playlist } from '../../interfaces/playlist';
import { Page } from '../../interfaces/page';
import { PlaylistService } from '../../services/playlist.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  playlists: Playlist[] = [];
  page: Page<Playlist> | null = null;
  currentPage = 0;
  pageSize = 10;
  selectedPlaylist: Playlist | null = null;

  constructor(private playlistService: PlaylistService, private router: Router) { }

  ngOnInit(): void {
    this.cargarPlaylists(this.currentPage, this.pageSize);
  }

  cargarPlaylists(page: number, size: number): void {
    this.playlistService.obtenerPlaylists(page, size).subscribe(data => {
      this.page = data;
      this.playlists = data.content;
    });
  }

  nextPage(): void {
    if (this.page && this.page.number < this.page.totalPages - 1) {
      this.currentPage++;
      this.cargarPlaylists(this.currentPage, this.pageSize);
    }
  }

  prevPage(): void {
    if (this.page && this.page.number > 0) {
      this.currentPage--;
      this.cargarPlaylists(this.currentPage, this.pageSize);
    }
  }

  togglePlaylistDetails(playlist: Playlist): void {
    this.selectedPlaylist = this.selectedPlaylist === playlist ? null : playlist;
  }

  playPlaylist(playlist: Playlist): void {
    this.router.navigate([`/playlist/${playlist.playlistID}`]);
  }
}
