// js/main.js
import { initMap } from './mapConfig.js';
import { datosEdificios, puntosBusqueda } from './markers.js';
import { iniciarGeolocalizacion } from './geolocation.js';

// Variables de Estado
let mapa = null;
let capaMarcadoresPrincipales = null; // Capa de los edificios (Iconos Grandes)
let capaInteriores = null;            // Capa de los salones (Puntitos)
let edificioActualID = null;          // ID del edificio seleccionado
let pisoActual = "PB";                // Piso actual

document.addEventListener("DOMContentLoaded", async () => {
  try {
    console.log("🚀 Iniciando sistema MIU...");
    mapa = await initMap();
    
    // Inicializamos las capas
    capaMarcadoresPrincipales = L.layerGroup().addTo(mapa);
    capaInteriores = L.layerGroup().addTo(mapa);
    
    // Cargamos la vista inicial
    cargarVistaGeneral(); 
    
    // Iniciamos módulos
    iniciarGeolocalizacion(mapa);
    iniciarBuscador(mapa);
    iniciarUI();
    iniciarControlPisos(); 
    iniciarResetClick(); // Detectar clic fuera para salir

  } catch (error) {
    console.error("🚨 Error crítico:", error);
  }
});

/* =========================================
   📍 1. VISTA GENERAL (Edificios)
   ========================================= */
function cargarVistaGeneral() {
  // Limpieza
  capaMarcadoresPrincipales.clearLayers();
  capaInteriores.clearLayers();
  edificioActualID = null;
  puntosBusqueda.length = 0; // Limpiamos buscador

  // Desactivamos todos los botones de piso
  actualizarBotonesPisos(null);

  // Generamos marcadores de Edificios
  Object.keys(datosEdificios).forEach(key => {
    const edificio = datosEdificios[key];
    
    // Marcador Principal (Azul por defecto de Leaflet o personalizado)
    const marker = L.marker(edificio.coords)
      .bindTooltip(`<strong>${edificio.nombre}</strong>`, { direction: 'top', offset: [0, -40] })
      .on('click', () => entrarAEdificio(key)); // Al hacer click, entra al edificio

    capaMarcadoresPrincipales.addLayer(marker);

    // Llenamos el buscador con los edificios principales
    puntosBusqueda.push({ nombre: edificio.nombre, coords: edificio.coords, marker: marker });
  });

  // Restaurar vista (Opcional, si quieres que se aleje al salir)
  // mapa.flyTo([19.39595, -99.09163], 17);
}

/* =========================================
   🏢 2. ENTRAR A EDIFICIO (Zoom In)
   ========================================= */
function entrarAEdificio(idEdificio) {
  const data = datosEdificios[idEdificio];
  edificioActualID = idEdificio;

  console.log(`🏢 Entrando a: ${data.nombre}`);

  // Ocultamos los marcadores grandes
  capaMarcadoresPrincipales.clearLayers();

  // Hacemos Zoom suave al edificio
  mapa.flyTo(data.coords, 20, { duration: 1.5 });

  // Cargamos la Planta Baja por defecto
  cambiarPiso("PB");

  // Actualizamos los botones (Grisear los que no existen)
  actualizarBotonesPisos(data.pisosDisponibles);
}

/* =========================================
   📶 3. CAMBIAR DE PISO (Lógica de Puntos)
   ========================================= */
function cambiarPiso(piso) {
  if (!edificioActualID) return;

  pisoActual = piso;
  capaInteriores.clearLayers(); // Borrar puntos del piso anterior

  const dataEdificio = datosEdificios[edificioActualID];
  // Validamos si el piso existe en los datos, si no, array vacío
  const lugaresPiso = dataEdificio.lugares[piso] || [];

  lugaresPiso.forEach(lugar => {
    // Creamos un puntito pequeño para los salones
    const iconoInterior = L.divIcon({
      className: 'punto-interior',
      html: `<div style="background-color: #d3d61f; width: 14px; height: 14px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [14, 14],
      popupAnchor: [0, -10]
    });

    L.marker(lugar.coords, { icon: iconoInterior })
      .bindPopup(`<strong>${lugar.nombre}</strong><br>${dataEdificio.nombre} - Planta ${piso}`)
      .addTo(capaInteriores);
  });
}

/* =========================================
   🎛️ CONTROL DE BOTONES (Grisear/Activar)
   ========================================= */
function iniciarControlPisos() {
  const botones = {
    "PB": document.getElementById("botonPlanta1"),
    "1": document.getElementById("botonPlanta2"),
    "2": document.getElementById("botonPlanta3"),
    "3": document.getElementById("botonPlanta4")
  };

  Object.keys(botones).forEach(pisoKey => {
    const btn = botones[pisoKey];
    if(btn) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation(); // Evitar que el mapa detecte click
        
        // Solo funciona si hay edificio seleccionado
        if(edificioActualID) {
            cambiarPiso(pisoKey);
            
            // Actualizar estilo visual (clase activo)
            Object.values(botones).forEach(b => b.classList.remove("activo"));
            btn.classList.add("activo");
        } else {
            // Animación de "No permitido" (opcional)
            btn.classList.add("shake");
            setTimeout(() => btn.classList.remove("shake"), 500);
        }
      });
    }
  });
}

function actualizarBotonesPisos(pisosDisponibles) {
  const botones = {
    "PB": document.getElementById("botonPlanta1"),
    "1": document.getElementById("botonPlanta2"),
    "2": document.getElementById("botonPlanta3"),
    "3": document.getElementById("botonPlanta4")
  };

  // Si pisosDisponibles es null, desactivamos todo (Vista General)
  if (!pisosDisponibles) {
    Object.values(botones).forEach(btn => {
      if(btn) {
        btn.disabled = true;
        btn.classList.add("desactivado");
        btn.classList.remove("activo");
      }
    });
    return;
  }

  // Si estamos en un edificio, activamos solo los que existen
  Object.keys(botones).forEach(pisoKey => {
    const btn = botones[pisoKey];
    if(btn) {
      if (pisosDisponibles.includes(pisoKey)) {
        btn.disabled = false;
        btn.classList.remove("desactivado");
        if(pisoKey === "PB") btn.classList.add("activo"); // PB activa por defecto al entrar
      } else {
        btn.disabled = true;
        btn.classList.add("desactivado");
        btn.classList.remove("activo");
      }
    }
  });
}

/* =========================================
   🔙 SALIR DEL EDIFICIO (Clic fuera)
   ========================================= */
function iniciarResetClick() {
  mapa.on('click', (e) => {
    // Si estamos dentro de un edificio...
    if (edificioActualID) {
        console.log("🔙 Saliendo a vista general...");
        cargarVistaGeneral();
        mapa.flyTo([19.39595, -99.09163], 18); // Zoom Out
    }
  });
}

/* =========================================
   🔍 BUSCADOR & UI
   ========================================= */
function iniciarBuscador(map) {
  const buscador = document.getElementById("buscador");
  const resultados = document.getElementById("resultados-busqueda");
  const buscadorToggle = document.getElementById("buscador-toggle");
  const buscadorContainer = document.getElementById("buscador-container");

  // Toggle visual
  buscadorToggle.addEventListener("click", () => {
    buscadorContainer.classList.toggle("oculto");
    if (!buscadorContainer.classList.contains("oculto")) buscador.focus();
  });

  // Lógica de búsqueda
  buscador.addEventListener("input", () => {
    const query = buscador.value.toLowerCase().trim();
    resultados.innerHTML = "";

    if (!query) {
      resultados.classList.add("oculto");
      return;
    }

    // Filtramos del array puntosBusqueda (que ahora solo tiene edificios principales)
    const filtrados = puntosBusqueda.filter(p => p.nombre.toLowerCase().includes(query));

    if (filtrados.length === 0) {
      resultados.innerHTML = '<li class="sin-resultados">No se encontró.</li>';
    } else {
      filtrados.forEach(p => {
        const li = document.createElement("li");
        li.textContent = p.nombre;
        li.addEventListener("click", () => {
          map.flyTo(p.coords, 19); // Vamos al lugar
          if (p.marker) p.marker.openPopup(); // Abrimos su info
          
          // Cerramos buscador
          resultados.classList.add("oculto");
          buscador.value = "";
          if (window.innerWidth <= 768) buscadorContainer.classList.add("oculto");
          
          // Si es un edificio, activamos su lógica
          // (Aquí podrías agregar lógica para activar entrarAEdificio automáticamente si buscas un edificio)
        });
        resultados.appendChild(li);
      });
    }
    resultados.classList.remove("oculto");
  });

  // Cerrar al dar click fuera
  document.addEventListener("click", (e) => {
    if (!buscador.contains(e.target) && !resultados.contains(e.target) && !buscadorToggle.contains(e.target)) {
      resultados.classList.add("oculto");
    }
  });
}

function iniciarUI() {
    const splash = document.getElementById("splash");
    const pantalla = document.getElementById("pantalla-inicio");
    const botonEntendido = document.getElementById("botonEntendido");
    const botonInfo = document.getElementById("botonInfo");

    // Splash Screen
    setTimeout(() => {
        if (splash) {
            splash.classList.add("fade-out");
            splash.addEventListener("animationend", () => splash.remove(), { once: true });
        }
        if (pantalla) {
            pantalla.classList.remove("oculto");
            pantalla.classList.add("fade-in");
        }
    }, 3500);

    // Botón Entendido
    botonEntendido.addEventListener("click", () => {
        pantalla.classList.remove("animarBienvenida");
        pantalla.classList.add("animarSalida");
        pantalla.addEventListener("animationend", () => {
            pantalla.style.display = "none";
            botonInfo.style.display = "flex"; 
        }, { once: true });
    });

    // Botón Info (Reabrir instrucciones)
    botonInfo.addEventListener("click", () => {
        pantalla.style.display = "flex";
        pantalla.classList.remove("oculto");
        pantalla.classList.remove("animarSalida");
        pantalla.classList.add("animarBienvenida");
        botonInfo.style.display = "none";
    });
}