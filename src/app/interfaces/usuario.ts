export interface Usuario {
    userID: number;
    username: string;
    email: string;
    password_hash: string;
    nombre: string;
    apellidos: string;
    fecha_creacion?: Date | null;
    roleID?: number | null;
    foto?: Blob | null;
}
