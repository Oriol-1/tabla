// src/lib/strapi.ts

const STRAPI_HOST = "http://localhost:1337"; // Asegúrate de que esta URL sea correcta

export async function query(endpoint: string) {
  try {
    const response = await fetch(`${STRAPI_HOST}/api/${endpoint}`);
    if (!response.ok) {
      throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
    }

    const data = await response.json();

    // Validación adicional para asegurar la estructura
    if (typeof data !== 'object' || data === null) {
      throw new Error("La respuesta no es un objeto válido.");
    }

    console.log("Datos recibidos de Strapi:", data); // Agregar log detallado de los datos

    return data;
  } catch (error) {
    console.error('Error al realizar la consulta a Strapi:', error);
    throw error;
  }
}

export default query;