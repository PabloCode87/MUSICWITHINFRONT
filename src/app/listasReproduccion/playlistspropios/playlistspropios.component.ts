import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Page } from '../../interfaces/page';
import { Playlist } from '../../interfaces/playlist';
import { PlaylistService } from '../../services/playlist.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-playlistspropios',
  templateUrl: './playlistspropios.component.html',
  styleUrls: ['./playlistspropios.component.css']
})
export class PlaylistspropiosComponent implements OnInit {

  playlistsPage?: Page<Playlist>;
  userID: number | undefined;
  playlists: Playlist[] = [];
  page: Page<Playlist> | null = null;
  currentPage = 0;
  pageSize = 10;
  selectedPlaylist: Playlist | null = null;

  constructor(private playlistService: PlaylistService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    const username = this.authService.getUsername();
    this.authService.getUserId(username).subscribe((id: number | null) => {
      if (id !== null) {
        this.userID = id;
        this.cargarPlaylists(this.currentPage, this.pageSize);
      } else {
        console.error('No se pudo obtener el userID.');
      }
    });
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
    this.router.navigate([`/playlist/${playlist.playlistID}`, { playlistName: playlist.playlist_name }]);
  }

  modifyPlaylist(playlist: Playlist): void {
    Swal.fire({
      title: 'Modificar Playlist',
      html: `
        <form id="editPlaylistForm">
          <div class="form-group">
            <label for="playlist_name">Nombre del Playlist:</label>
            <input type="text" id="playlist_name" name="playlist_name" class="form-control" value="${playlist.playlist_name}" required>
          </div>
          <div class="form-group">
            <label for="description">Descripción:</label>
            <textarea id="description" name="description" class="form-control" rows="3" required>${playlist.description}</textarea>
          </div>
          <div class="form-group">
            <label for="status">Estado:</label>
            <select id="status" name="status" class="form-control">
              <option value="PUBLICA" ${playlist.status === 'PUBLICA' ? 'selected' : ''}>Pública</option>
              <option value="PRIVADA" ${playlist.status === 'PRIVADA' ? 'selected' : ''}>Privada</option>
            </select>
          </div>
        </form>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      preConfirm: () => {
        const form = Swal.getPopup()?.querySelector('#editPlaylistForm') as HTMLFormElement;
        const formData = new FormData(form);
        const updatedPlaylist: Playlist = {
          ...playlist,
          playlist_name: formData.get('playlist_name') as string,
          description: formData.get('description') as string,
          status: formData.get('status') as string
        };
        return updatedPlaylist;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.playlistService.updatePlaylist(playlist.playlistID, result.value).subscribe(updatedPlaylist => {
          const index = this.playlists.findIndex(p => p.playlistID === updatedPlaylist.playlistID);
          if (index !== -1) {
            this.playlists[index] = updatedPlaylist;
          }
          Swal.fire('Guardado!', 'El playlist ha sido actualizado.', 'success');
        }, error => {
          console.error('Error updating playlist', error);
          Swal.fire('Error!', 'Hubo un problema al actualizar el playlist.', 'error');
        });
      }
    });
  }

  deletePlaylist(playlist: Playlist): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el playlist "${playlist.playlist_name}"? Esta acción no se puede deshacer.`,
      icon: 'warning',
      input: 'text',
      inputLabel: 'Escribe "BORRAR" en mayúsculas',
      inputPlaceholder: 'Escribe "BORRAR"',
      inputAttributes: {
        'aria-label': 'Escribe "BORRAR"',
        required: 'true'
      },
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      preConfirm: (inputText) => {
        if (!inputText || inputText !== 'BORRAR') {
          Swal.showValidationMessage('Debes escribir "BORRAR" en mayúsculas');
        }
        return inputText;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.playlistService.deletePlaylist(playlist.playlistID).subscribe(() => {
          Swal.fire(
            'Eliminado!',
            'El playlist ha sido eliminado.',
            'success'
          );
          this.cargarPlaylists(this.currentPage, this.pageSize);
        }, error => {
          Swal.fire(
            'Error!',
            'Hubo un problema al eliminar el playlist.',
            'error'
          );
        });
      }
    });
  }
  
}
