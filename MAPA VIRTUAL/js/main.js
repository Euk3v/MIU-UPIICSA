import { initMap } from './mapConfig.js';
import { cargarMarcadores, puntosBusqueda } from './markers.js';
import { iniciarGeolocalizacion } from './geolocation.js';

document.addEventListener("DOMContentLoaded", async () => {
  try {
    console.log("🚀 Iniciando aplicación...");

    const map = await initMap();
    cargarMarcadores(map);
    iniciarGeolocalizacion(map); // GPS
    iniciarBuscador(map);
    iniciarUI();

  } catch (error) {
    console.error("🚨 Error crítico:", error);
  }
});

function iniciarBuscador(map) {
  const buscador = document.getElementById("buscador");
  const resultados = document.getElementById("resultados-busqueda");
  const buscadorToggle = document.getElementById("buscador-toggle");
  const buscadorContainer = document.getElementById("buscador-container");

  buscadorToggle.addEventListener("click", () => {
    buscadorContainer.classList.toggle("oculto");
    if (!buscadorContainer.classList.contains("oculto")) {
        buscador.focus();
    }
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
      resultados.innerHTML = '<li class="sin-resultados">No se encontró ningún lugar.</li>';
    } else {
      filtrados.forEach(p => {
        const li = document.createElement("li");
        li.textContent = p.nombre;
        li.addEventListener("click", () => {
          map.setView(p.coords, 20);
          if (p.marker) p.marker.openPopup();
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
            botonInfo.style.display = "flex"; // Se muestra como flex para centrar icono
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