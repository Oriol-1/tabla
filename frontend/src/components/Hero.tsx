// src/components/Hero.tsx

"use client"; // Indica que es un componente de cliente

import React, { useState, useEffect, useCallback } from 'react';
import { getHomeInfo } from '../lib/get-home-info'; // Asegúrate de que esta ruta sea correcta
import * as XLSX from 'xlsx'; // Importa la biblioteca xlsx
import './home.css'; // Importa el archivo CSS
import { Juego } from '../types/api'; // Asegúrate de que esta ruta sea correcta

export const Hero = () => {
  const [juegos, setJuegos] = useState<Juego[]>([]);
  const [homeJuegos, setHomeJuegos] = useState<Juego[]>([]); // Estado para los juegos de la home
  const [filteredJuegos, setFilteredJuegos] = useState<Juego[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [title, setTitle] = useState<string>(''); // Estado para el título

  // Estados para los filtros
  const [selectedConsola, setSelectedConsola] = useState<string>('');
  const [selectedDesarrollador, setSelectedDesarrollador] = useState<string>('');
  const [searchJuego, setSearchJuego] = useState<string>('');
  const [searchNumero, setSearchNumero] = useState<string>('');
  const [searchMes, setSearchMes] = useState<string>('');
  const [searchAno, setSearchAno] = useState<string>('');
  const [searchPagina, setSearchPagina] = useState<string>('');
  const [searchNota, setSearchNota] = useState<string>('');

  // Función para obtener datos de Strapi
  const fetchData = async () => {
    try {
      console.log("Fetching data from Strapi API...");
      const data = await getHomeInfo();
      console.log("Full JSON response:", data);
      
      if (data && data.home) {
        const juegosData = data.juegos || []; // Juegos de la API
        const homeData = data.home; // Datos de home

        setTitle(homeData.title || "Título no disponible"); // Establece el título desde Strapi
        setHomeJuegos(homeData.juego || []); // Establece los juegos de la home
        setJuegos(juegosData); // Establece los juegos de la API
        setFilteredJuegos([...juegosData, ...(homeData.juego || [])]); // Combina ambos conjuntos de juegos
      } else {
        setErrorMessage("La estructura de los datos recibidos no es la esperada.");
        console.error("Estructura de datos inesperada:", data);
      }
    } catch (error) {
      setErrorMessage("Error al obtener los datos del servidor.");
      console.error("Error al obtener los datos del servidor:", error);
    }
  };

  // Efecto para obtener datos al montar el componente
  useEffect(() => {
    fetchData(); // Llama a fetchData al montar el componente
  }, []);

  // Usar useCallback para memorizar la función de filtrado
  const handleFilterChange = useCallback(() => {
    setFilteredJuegos(
      [...juegos, ...homeJuegos].filter(juego => {
        const matchesConsola = selectedConsola ? juego.Consola === selectedConsola : true;
        const matchesDesarrollador = selectedDesarrollador ? juego.Desarrollador === selectedDesarrollador : true;

        // Verificamos que las propiedades estén definidas y convertimos a string
        const matchesJuego = juego.Juego && juego.Juego.toLowerCase().includes(searchJuego.toLowerCase());
        const matchesNumero = juego.Número && juego.Número.includes(searchNumero);
        const matchesMes = juego.Mes && juego.Mes.toLowerCase().includes(searchMes.toLowerCase());
        const matchesAno = juego.Año && juego.Año.includes(searchAno);
        const matchesPagina = juego.Pag && juego.Pag.includes(searchPagina);
        const matchesNota = juego.Nota && juego.Nota.includes(searchNota);

        return matchesConsola && matchesDesarrollador && matchesJuego && matchesNumero && matchesMes && matchesAno && matchesPagina && matchesNota;
      })
    );
  }, [juegos, homeJuegos, selectedConsola, selectedDesarrollador, searchJuego, searchNumero, searchMes, searchAno, searchPagina, searchNota]); // Dependencias

  // Efecto para aplicar filtros cuando cambian los estados de los filtros
  useEffect(() => {
    handleFilterChange();
  }, [handleFilterChange]); // Cambiar la dependencia

  // Obtener listas únicas para las opciones de filtro
  const consolas = Array.from(new Set([...juegos, ...homeJuegos].map(juego => juego.Consola)));
  const desarrolladores = Array.from(new Set([...juegos, ...homeJuegos].map(juego => juego.Desarrollador)));

  // Función para exportar a Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredJuegos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Juegos");
    XLSX.writeFile(workbook, "juegos_filtrados.xlsx");
  };

  return (
    <div className="home-container">
      {/* Mostrar el título de la home */}
      <h1 className="home-title">{title}</h1> {/* Mostrar el título actualizado */}

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Contenedor para el botón de exportar */}
      <div className="export-container">
        {/* Botón para exportar a Excel con ícono */}
        <button onClick={exportToExcel} className="export-button">
          <i className="fas fa-file-excel"></i> Exportar a Excel
        </button>
      </div>

      {/* Filtros */}
      <div className="filters">
        <label>
          Consola:
          <select value={selectedConsola} onChange={(e) => setSelectedConsola(e.target.value)} className="filter-select">
            <option value="">Todas</option>
            {consolas.map((consola, index) => (
              <option key={index} value={consola}>{consola}</option>
            ))}
          </select>
        </label>

        <label>
          Desarrollador:
          <select value={selectedDesarrollador} onChange={(e) => setSelectedDesarrollador(e.target.value)} className="filter-select">
            <option value="">Todos</option>
            {desarrolladores.map((desarrollador, index) => (
              <option key={index} value={desarrollador}>{desarrollador}</option>
            ))}
          </select>
        </label>

        {/* Filtros de texto para cada columna */}
        <label>
          Juego:
          <input type="text" value={searchJuego} onChange={(e) => setSearchJuego(e.target.value)} placeholder="Buscar juego..." className="filter-input" />
        </label>

        <label>
          Número:
          <input type="text" value={searchNumero} onChange={(e) => setSearchNumero(e.target.value)} placeholder="Buscar número..." className="filter-input" />
        </label>

        <label>
          Mes:
          <input type="text" value={searchMes} onChange={(e) => setSearchMes(e.target.value)} placeholder="Buscar mes..." className="filter-input" />
        </label>

        <label>
          Año:
          <input type="text" value={searchAno} onChange={(e) => setSearchAno(e.target.value)} placeholder="Buscar año..." className="filter-input" />
        </label>

        <label>
          Página:
          <input type="text" value={searchPagina} onChange={(e) => setSearchPagina(e.target.value)} placeholder="Buscar página..." className="filter-input" />
        </label>

        <label>
          Nota:
          <input type="text" value={searchNota} onChange={(e) => setSearchNota(e.target.value)} placeholder="Buscar nota..." className="filter-input" />
        </label>
      </div>

      {/* Tabla de juegos filtrados */}
      <table className="games-table">
        <thead>
          <tr>
            <th>Juego</th>
            <th>Consola</th>
            <th>Desarrollador</th>
            <th>Número</th>
            <th>Mes</th>
            <th>Año</th>
            <th>Página</th>
            <th>Nota</th>
          </tr>
        </thead>
        <tbody>
          {filteredJuegos.map((juego, index) => (
            <tr key={index}>
              <td>{juego.Juego}</td>
              <td>{juego.Consola}</td>
              <td>{juego.Desarrollador}</td>
              <td>{juego.Número}</td>
 <td>{juego.Mes}</td>
              <td>{juego.Año}</td>
              <td>{juego.Pag}</td>
              <td>{juego.Nota}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Hero;