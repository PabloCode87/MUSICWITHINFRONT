import { Usuario } from "./usuario";

export interface Playlist {
  playlistID: number;
  playlist_name: string;
  description: string;
  creation_date: string;
  status: string;
  usuario: {
    userID: number;
    username: string;
    nombre: string;
    apellidos: string;
    fecha_creacion: string;
    email: string;
    password_hash: string;
    foto: string | null;
  };
}