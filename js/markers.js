// js/markers.js

// 1. BASE DE DATOS JERÁRQUICA (Edificio -> Pisos -> Lugares)
export const datosEdificios = {
  "gobierno": {
    nombre: "Edificio de Gobierno",
    coords: [19.39595, -99.09163], // Coordenada central del edificio
    descripcion: "Trámites y Dirección",
    pisosDisponibles: ["PB", "1"], // Solo activa Planta BJ y Planta 1
    lugares: {
      "PB": [
        { nombre: "Dirección", coords: [19.39599, -99.09168], tipo: "oficina" },
        { nombre: "Gestión Escolar", coords: [19.39590, -99.09160], tipo: "tramites" },
        { nombre: "Caja", coords: [19.39592, -99.09162], tipo: "pagos" }
      ],
      "1": [
        { nombre: "Sala de Juntas", coords: [19.39599, -99.09168], tipo: "sala" },
        { nombre: "Decanato", coords: [19.39592, -99.09165], tipo: "oficina" }
      ],
      "2": [], // Vacío
      "3": []  // Vacío
    }
  },
  "culturales": {
    nombre: "Edificio de Culturales",
    coords: [19.39650, -99.09200], 
    descripcion: "Auditorio y Actividades",
    pisosDisponibles: ["PB"], // Solo activa Planta BJ
    lugares: {
      "PB": [
        { nombre: "Auditorio", coords: [19.39655, -99.09205], tipo: "auditorio" },
        { nombre: "Salón de Danza", coords: [19.39645, -99.09195], tipo: "salon" }
      ]
    }
  },
  "pesados": {
    nombre: "Laboratorios Pesados",
    coords: [19.39500, -99.09100], 
    descripcion: "Ingeniería Industrial",
    pisosDisponibles: ["PB", "1", "2"], // Activa BJ, 1 y 2
    lugares: {
      "PB": [{ nombre: "Maquinaria Pesada", coords: [19.39505, -99.09105], tipo: "lab" }],
      "1": [{ nombre: "Aulas de Cómputo", coords: [19.39505, -99.09105], tipo: "aula" }],
      "2": [{ nombre: "Laboratorio de Química", coords: [19.39505, -99.09105], tipo: "lab" }]
    }
  }
};

// Array vacío que se llenará dinámicamente en main.js para el buscador
export const puntosBusqueda = [];