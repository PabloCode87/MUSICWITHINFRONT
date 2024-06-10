export interface Evento {
    eventoID?: number;
    nombre_evento: string;
    fecha_creacion: Date;
    lugar_evento: string;
    userID: number;
    usuariosAsistentes?: any[];
  }
  