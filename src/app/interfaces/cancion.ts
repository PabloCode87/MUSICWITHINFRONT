import { SafeUrl } from "@angular/platform-browser";

export interface Cancion {
    songID: number;
    song_name: string;
    artist: string;
    genre: string;
    duration: string;
    albumID: number | null;
    audio_file: string;
    uploaded_by: number;
    safeAudioUrl?: SafeUrl | null;
  }