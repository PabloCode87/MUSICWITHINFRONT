import { Injectable } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cancion } from '../interfaces/cancion';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlaylistPlayerService {
  public audioPlayer: HTMLAudioElement | null = null;
  private currentAudioUrl: SafeUrl | null = null;
  private isPlayingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isPlaying$: Observable<boolean> = this.isPlayingSubject.asObservable();

  private apiUrl = 'http://localhost:8080/playlistsong';

  constructor(private http: HttpClient) { }

  getCancionesByPlaylistID(playlistID: number): Observable<Cancion[]> {
    const url = `${this.apiUrl}/${playlistID}/canciones`;
    return this.http.get<Cancion[]>(url);
  }

  play(audioUrl: SafeUrl): void {
    this.stop();  // Stop any currently playing audio before starting a new one
    this.audioPlayer = new Audio(audioUrl.toString());
    this.audioPlayer.play();
    this.currentAudioUrl = audioUrl;
    this.isPlayingSubject.next(true);
    this.audioPlayer.onended = () => {
      this.isPlayingSubject.next(false);
    };
  }

  pause(): void {
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.isPlayingSubject.next(false);
    }
  }

  stop(): void {
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer.currentTime = 0;  // Reset playback position
      this.isPlayingSubject.next(false);
    }
  }

  getCurrentAudioUrl(): SafeUrl | null {
    return this.currentAudioUrl;
  }
}
