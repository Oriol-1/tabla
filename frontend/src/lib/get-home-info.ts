// src/lib/get-home-info.ts

import { query } from "./strapi";
import { Juego } from '../types/api'; // Asegúrate de que esta ruta sea correcta

export async function getHomeInfo() {
    const homeData = await query("home");
    const juegosData = await query("juegos");

    return {
        home: homeData.data || {}, // Asegúrate de que se esté obteniendo el objeto home
        juegos: juegosData.data.map((item: { juego: Juego }) => item.juego) || [] // Cambia 'any' a 'Juego'
    };
}