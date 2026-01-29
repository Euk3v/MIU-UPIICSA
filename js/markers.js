// js/markers.js

// BASE DE DATOS JERÁRQUICA (Edificio -> Pisos -> Lugares)
export const datosEdificios = {
  "gobierno": {
    nombre: "Edificio de Gobierno",
    coords: [19.39602311782216, -99.09251433761311],
    descripcion: "Dirección, Gestión Escolar y Servicios Médicos",
    icono: "assets/logos/gobierno.png",
    pisosDisponibles: ["PB", "1"], 
    lugares: {
      "PB": [
        // --- LADO IZQUIERDO Y ABAJO ---
        { nombre: "Subdirección Administrativa", coords: [19.395837796528298, -99.09237553329902], tipo: "direccion" },
        { nombre: "Área Secretarial (Admin)", coords: [19.3958498139565, -99.09253445418076], tipo: "oficina" },
        
        // --- ARRIBA (Salud) ---
        { nombre: "Atención a la Salud (Enfermería)", coords: [19.39600, -99.09163], tipo: "salud" },
        { nombre: "Sanitarios PB (Hombres/Mujeres)", coords: [19.39600, -99.09165], tipo: "bano" },

        // --- DERECHA ---
        { nombre: "Gestión Escolar (Ventanillas)", coords: [19.39595, -99.09155], tipo: "tramites" },
        { nombre: "Subdirección de Serv. Educativos", coords: [19.39585, -99.09155], tipo: "direccion" }
      ],
      "1": [
        // --- DIRECCIÓN (Abajo Derecha) ---
        { nombre: "Dirección", coords: [19.39585, -99.09155], tipo: "direccion" },
        { nombre: "Área Secretarial (Dirección)", coords: [19.39588, -99.09158], tipo: "oficina" },

        // --- ACADÉMICA (Abajo Izquierda) ---
        { nombre: "Subdirección Académica", coords: [19.39585, -99.09170], tipo: "direccion" },
        { nombre: "Depto. Evaluación y Seguimiento", coords: [19.39588, -99.09172], tipo: "oficina" },

        // --- JEFATURAS DE CARRERA (Izquierda) ---
        { nombre: "Jefatura Ing. Industrial", coords: [19.39592, -99.09175], tipo: "oficina" },
        { nombre: "Jefatura Ing. Informática", coords: [19.39594, -99.09175], tipo: "oficina" },
        { nombre: "Admin. Industrial", coords: [19.39596, -99.09175], tipo: "oficina" },
        { nombre: "Ing. Transporte y Sist. Automotrices", coords: [19.39598, -99.09175], tipo: "oficina" },

        // --- ARRIBA (Servicios Estudiantiles) ---
        { nombre: "Extensión y Apoyos Educativos", coords: [19.39605, -99.09175], tipo: "tramites" },
        { nombre: "Farmacia", coords: [19.39605, -99.09168], tipo: "salud" },
        { nombre: "Servicio Dental", coords: [19.39605, -99.09165], tipo: "salud" },
        { nombre: "Orientación Educativa", coords: [19.39605, -99.09162], tipo: "tramites" },
        { nombre: "Consultorios (Nutrición/Psicología)", coords: [19.39605, -99.09160], tipo: "salud" },

        // --- DERECHA ---
        { nombre: "Asesoría Jurídica", coords: [19.39598, -99.09155], tipo: "oficina" },
        { nombre: "Sanitarios Piso 1", coords: [19.39595, -99.09155], tipo: "bano" }
      ],
      "2": [], "3": []
    }
  },
  "culturales": {
    nombre: "Edificio de Culturales",
    coords: [19.39650, -99.09200], 
    descripcion: "Auditorio y Actividades",
    icono: "culturales.png",
    pisosDisponibles: ["PB"], 
    lugares: {
      "PB": [
        { nombre: "Auditorio A", coords: [19.39655, -99.09205], tipo: "auditorio" },
        { nombre: "Salón de Danza", coords: [19.39645, -99.09195], tipo: "salon" },
        { nombre: "Baños", coords: [19.39640, -99.09190], tipo: "bano" }
      ]
    }
  },
  "pesados": {
    nombre: "Laboratorios Pesados",
    coords: [19.39500, -99.09100], 
    descripcion: "Ingeniería Industrial y Química",
    icono: "pesados.png",
    pisosDisponibles: ["PB", "1", "2"], 
    lugares: {
      "PB": [
        { nombre: "Maquinaria Pesada", coords: [19.39505, -99.09105], tipo: "lab" },
        { nombre: "Cafetería", coords: [19.39495, -99.09095], tipo: "comida" }
      ],
      "1": [{ nombre: "Aulas de Cómputo", coords: [19.39505, -99.09105], tipo: "aula" }],
      "2": [{ nombre: "Laboratorio de Química", coords: [19.39505, -99.09105], tipo: "lab" }]
    }
  }
};

// Array vacío que se llenará dinámicamente en main.js para el buscador
export const puntosBusqueda = [];