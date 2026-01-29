// js/main.js
import { initMap } from './mapConfig.js';
import { datosEdificios, puntosBusqueda } from './markers.js';
import { iniciarGeolocalizacion } from './geolocation.js';

// Variables de Estado
let mapa = null;
let capaMarcadoresPrincipales = null; 
let capaInteriores = null;            
let edificioActualID = null;          
let pisoActual = "PB";                

document.addEventListener("DOMContentLoaded", async () => {
  try {
    console.log("🚀 Iniciando sistema MIU...");
    mapa = await initMap();
    
    // Inicializamos las capas
    capaMarcadoresPrincipales = L.layerGroup().addTo(mapa);
    capaInteriores = L.layerGroup().addTo(mapa);
    
    cargarVistaGeneral(); 
    
    iniciarGeolocalizacion(mapa);
    iniciarBuscador(mapa);
    iniciarUI();
    iniciarControlPisos(); 
    iniciarResetClick(); 

  } catch (error) {
    console.error("🚨 Error crítico:", error);
  }
});

/* =========================================
   📍 1. VISTA GENERAL
   ========================================= */
function cargarVistaGeneral() {
  capaMarcadoresPrincipales.clearLayers();
  capaInteriores.clearLayers();
  edificioActualID = null;
  puntosBusqueda.length = 0; 

  actualizarBotonesPisos(null);

  Object.keys(datosEdificios).forEach(key => {
    const edificio = datosEdificios[key];
    
    // --- 🎨 AJUSTE FINAL DE POSICIÓN ---
    const customIcon = L.icon({
      iconUrl: edificio.icono,
      
      // Tamaño Grande
      iconSize: [120, 160],     
      
      // ⚓ ANCLAJE CORREGIDO (El secreto para que no se mueva)
      // [60]: Centro horizontal (mitad de 120).
      // [138]: Altura de la punta visual. (Bajamos de 160 a 138 para que el pin "baje" al suelo)
      iconAnchor: [60, 138],   
      
      popupAnchor: [0, -140],  
      className: 'mi-icono-animado' 
    });

    const marker = L.marker(edificio.coords, { icon: customIcon })
      .bindTooltip(`<strong>${edificio.nombre}</strong>`, { direction: 'top', offset: [0, -130] })
      .on('click', () => entrarAEdificio(key));

    capaMarcadoresPrincipales.addLayer(marker);

    // (Puntos rojos eliminados) 🗑️

    puntosBusqueda.push({ nombre: edificio.nombre, coords: edificio.coords, marker: marker });
  });
}

/* =========================================
   🏢 2. ENTRAR A EDIFICIO
   ========================================= */
function entrarAEdificio(idEdificio) {
  const data = datosEdificios[idEdificio];
  edificioActualID = idEdificio;

  console.log(`🏢 Entrando a: ${data.nombre}`);

  capaMarcadoresPrincipales.clearLayers();
  mapa.flyTo(data.coords, 20, { duration: 1.5 });
  cambiarPiso("PB");
  actualizarBotonesPisos(data.pisosDisponibles);
}

/* =========================================
   📶 3. CAMBIAR DE PISO
   ========================================= */
function cambiarPiso(piso) {
  if (!edificioActualID) return;

  pisoActual = piso;
  capaInteriores.clearLayers(); 

  const dataEdificio = datosEdificios[edificioActualID];
  const lugaresPiso = dataEdificio.lugares[piso] || [];

  lugaresPiso.forEach(lugar => {
    let iconoClass = 'bx bxs-circle'; 
    let colorFondo = '#d3d61f';       

    switch(lugar.tipo) {
        case 'bano':
            iconoClass = 'bx bx-male-female';
            colorFondo = '#3b82f6'; 
            break;
        case 'salud': 
            iconoClass = 'bx bxs-ambulance';
            colorFondo = '#ef4444'; 
            break;
        case 'comida':
        case 'cafeteria':
            iconoClass = 'bx bxs-coffee';
            colorFondo = '#f97316'; 
            break;
        case 'pagos':
        case 'caja':
            iconoClass = 'bx bxs-dollar-circle';
            colorFondo = '#16a34a'; 
            break;
        case 'tramites':
            iconoClass = 'bx bxs-id-card';
            colorFondo = '#0891b2'; 
            break;
        case 'oficina':
        case 'direccion':
            iconoClass = 'bx bxs-briefcase';
            colorFondo = '#8b5cf6'; 
            break;
        case 'sala':
            iconoClass = 'bx bxs-group';
            colorFondo = '#6366f1'; 
            break;
        case 'auditorio':
            iconoClass = 'bx bxs-microphone';
            colorFondo = '#ef4444'; 
            break;
        case 'aula':
        case 'salon':
            iconoClass = 'bx bxs-book';
            colorFondo = '#10b981'; 
            break;
        case 'lab':
            iconoClass = 'bx bxs-flask';
            colorFondo = '#0d9488'; 
            break;
    }

    const htmlIcono = `
        <div style="
            background-color: ${colorFondo};
            width: 28px; height: 28px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex; justify-content: center; align-items: center;
            color: white; font-size: 16px;">
            <i class='${iconoClass}'></i>
        </div>`;

    const customIcon = L.divIcon({
      className: 'icono-interior-dinamico',
      html: htmlIcono,
      iconSize: [28, 28],
      popupAnchor: [0, -14]
    });

    L.marker(lugar.coords, { icon: customIcon })
      .bindPopup(`
        <div style="text-align:center;">
            <i class='${iconoClass}' style="font-size: 24px; color: ${colorFondo}; margin-bottom: 5px;"></i><br>
            <strong>${lugar.nombre}</strong><br>
            <span style="font-size:0.9em; color:#666;">${dataEdificio.nombre} - Planta ${piso}</span>
        </div>
      `)
      .addTo(capaInteriores);
  });
}

/* =========================================
   🎛️ CONTROL DE BOTONES
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
        e.stopPropagation(); 
        if(edificioActualID) {
            cambiarPiso(pisoKey);
            Object.values(botones).forEach(b => b.classList.remove("activo"));
            btn.classList.add("activo");
        } else {
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

  Object.keys(botones).forEach(pisoKey => {
    const btn = botones[pisoKey];
    if(btn) {
      if (pisosDisponibles.includes(pisoKey)) {
        btn.disabled = false;
        btn.classList.remove("desactivado");
        if(pisoKey === "PB") btn.classList.add("activo"); 
      } else {
        btn.disabled = true;
        btn.classList.add("desactivado");
        btn.classList.remove("activo");
      }
    }
  });
}

/* =========================================
   🔙 SALIR DEL EDIFICIO
   ========================================= */
function iniciarResetClick() {
  mapa.on('click', (e) => {
    if (edificioActualID) {
        console.log("🔙 Saliendo a vista general...");
        cargarVistaGeneral();
        mapa.flyTo([19.39595, -99.09163], 18); 
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

  buscadorToggle.addEventListener("click", () => {
    buscadorContainer.classList.toggle("oculto");
    if (!buscadorContainer.classList.contains("oculto")) buscador.focus();
  });

  buscador.addEventListener("input", () => {
    const query = buscador.value.toLowerCase().trim();
    resultados.innerHTML = "";

    if (!query) {
      resultados.classList.add("oculto");
      return;
    }

    const filtrados = puntosBusqueda.filter(p => p.nombre.toLowerCase().includes(query));

    if (filtrados.length === 0) {
      resultados.innerHTML = '<li class="sin-resultados">No se encontró.</li>';
    } else {
      filtrados.forEach(p => {
        const li = document.createElement("li");
        li.textContent = p.nombre;
        li.addEventListener("click", () => {
          map.flyTo(p.coords, 20); 
          if (p.marker) p.marker.fire('click'); 
          resultados.classList.add("oculto");
          buscador.value = "";
          if (window.innerWidth <= 768) buscadorContainer.classList.add("oculto");
        });
        resultados.appendChild(li);
      });
    }
    resultados.classList.remove("oculto");
  });

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

    botonEntendido.addEventListener("click", () => {
        pantalla.classList.remove("animarBienvenida");
        pantalla.classList.add("animarSalida");
        pantalla.addEventListener("animationend", () => {
            pantalla.style.display = "none";
            botonInfo.style.display = "flex"; 
        }, { once: true });
    });

    botonInfo.addEventListener("click", () => {
        pantalla.style.display = "flex";
        pantalla.classList.remove("oculto");
        pantalla.classList.remove("animarSalida");
        pantalla.classList.add("animarBienvenida");
        botonInfo.style.display = "none";
    });
}