import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cancion } from '../../interfaces/cancion';
import { PlaylistPlayerService } from '../../services/playlist-player.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { PlaylistService } from '../../services/playlist.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.css']
})
export class PlaylistDetailComponent implements OnInit {
  songs: Cancion[] = [];
  currentAudioUrl: SafeUrl | null = null;
  isPlaying = false;
  playlistName: string = '';
  isShuffling = false;
  playlistUserID: number | null = null;
  currentUserID: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playlistPlayerService: PlaylistPlayerService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private playlistService: PlaylistService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const playlistID = this.route.snapshot.paramMap.get('playlistID');
    this.playlistName = this.route.snapshot.paramMap.get('playlistName') || 'Nombre del Playlist';

    if (playlistID) {
      this.playlistPlayerService.getCancionesByPlaylistID(+playlistID).subscribe((data: Cancion[]) => {
        this.songs = data;
        this.songs.forEach(song => {
          if (song.audio_file) {
            song.safeAudioUrl = this.sanitizer.bypassSecurityTrustUrl('data:audio/mp3;base64,' + song.audio_file);
          }
        });
      });

      // Usando el nuevo método para obtener detalles del playlist
      this.playlistService.getPlaylistById(+playlistID).subscribe(playlist => {
        this.playlistUserID = playlist.usuario.userID;
      });

      this.authService.getUserId(this.authService.getUsername()).subscribe(userId => {
        this.currentUserID = userId;
      });
    }
  }

  play(song: Cancion): void {
    const audioUrl = song.safeAudioUrl;
    if (audioUrl) {
      if (this.currentAudioUrl !== audioUrl) {
        this.currentAudioUrl = audioUrl;
        this.playlistPlayerService.play(audioUrl);
        this.isPlaying = true;
        this.setSongEndListener();
      } else if (!this.isPlaying) {
        this.playlistPlayerService.play(audioUrl);
        this.isPlaying = true;
      }
    }
  }

  setSongEndListener(): void {
    if (this.playlistPlayerService.audioPlayer) {
      this.playlistPlayerService.audioPlayer.onended = () => {
        this.onSongEnd();
      };
    }
  }

  onSongEnd(): void {
    if (this.isShuffling) {
      this.playRandomSong();
    } else {
      this.pause();
    }
  }

  pause(): void {
    if (this.currentAudioUrl) {
      this.playlistPlayerService.stop();
      this.isPlaying = false;
    }
  }

  shufflePlaylist(): void {
    this.isShuffling = true;
    this.playRandomSong();
  }

  playRandomSong(): void {
    if (this.songs.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.songs.length);
      const randomSong = this.songs[randomIndex];
      this.play(randomSong);
    }
  }

  copyLink(): void {
    const link = window.location.href;
    navigator.clipboard.writeText(link).then(() => {
      this.toastr.success('Link copiado al portapapeles', 'Éxito');
    }).catch(() => {
      this.toastr.error('Error al copiar el link', 'Error');
    });
  }

  confirmDelete(song: Cancion): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la canción ${song.song_name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteSong(song);
      }
    });
  }

  deleteSong(song: Cancion): void {
    const playlistID = this.route.snapshot.paramMap.get('playlistID');
    if (playlistID) {
      this.playlistService.removeFromPlaylist(+playlistID, song.songID).subscribe(
        () => {
          this.songs = this.songs.filter(s => s.songID !== song.songID);
          this.toastr.success('Canción eliminada del playlist', 'Éxito');
        },
        error => {
          this.toastr.error('Error al eliminar la canción', 'Error');
        }
      );
    }
  }
}
