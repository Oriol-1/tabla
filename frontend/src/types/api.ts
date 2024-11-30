// src/types/api.ts
export interface Juego {
    Juego: string;
    Consola: string;
    "Marca consola": string;
    Desarrollador: string;
    Número: string; // Cambiado a string
    Mes: string;
    Año: string; // Cambiado a string
    Pag: string; // Cambiado a string
    Nota: string; // Cambiado a string
}

export interface HomeResponse {
    data: {
        id: number;
        documentId: string;
        title: string;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
        juego: Juego[];
    };
}