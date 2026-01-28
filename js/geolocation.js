let watchId = null;
let userMarker = null;
let accuracyCircle = null;
let mapInstance = null;

// Coordenadas de UPIICSA (La "Base")
const UPIICSA_COORDS = [19.39595, -99.09163];
const DEFAULT_ZOOM = 18;

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

export function iniciarGeolocalizacion(map) {
  mapInstance = map;

  const GpsControl = L.Control.extend({
    options: { position: 'bottomright' },

    onAdd: function () {
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-gps');
      const btn = L.DomUtil.create('a', 'gps-button', container);
      btn.href = "#";
      btn.title = "Mi ubicación";
      
      // ✅ ICONO INICIAL (MIRA)
      btn.innerHTML = "<i class='bx bx-crosshair'></i>";
      
      btn.role = "button";

      L.DomEvent.disableClickPropagation(container);

      btn.onclick = (e) => {
        e.preventDefault();
        toggleSeguimiento(container); // Pasamos el contenedor para cambiar estilos
      };

      return container;
    }
  });

  map.addControl(new GpsControl());
}

function toggleSeguimiento(btnContainer) {
  const icon = btnContainer.querySelector('i');

  if (watchId) {
    // 🛑 DETENER GEOLOCALIZACIÓN
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
    btnContainer.classList.remove('activo');
    
    // ✅ VOLVER A ICONO DE MIRA
    if (icon) icon.className = 'bx bx-crosshair';
    
    if (userMarker) {
      mapInstance.removeLayer(userMarker);
      mapInstance.removeLayer(accuracyCircle);
      userMarker = null;
      accuracyCircle = null;
    }

    // ✨ VUELTA A CASA (La magia nueva) ✨
    // Hacemos que el mapa "vuele" de regreso a UPIICSA suavemente
    console.log("✈️ Regresando a UPIICSA...");
    mapInstance.flyTo(UPIICSA_COORDS, DEFAULT_ZOOM, {
        animate: true,
        duration: 1.5 // Tarda 1.5 segundos en llegar (efecto visual)
    });

  } else {
    // ▶️ INICIAR GEOLOCALIZACIÓN
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.");
      return;
    }

    btnContainer.classList.add('activo');
    
    // ✅ CAMBIAR A ICONO DE NAVEGACIÓN (FLECHA)
    if (icon) icon.className = 'bx bxs-navigation';
    
    console.log("🛰️ Buscando ubicación...");
    watchId = navigator.geolocation.watchPosition(actualizarPosicion, manejarError, options);
  }
}

function actualizarPosicion(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  const accuracy = position.coords.accuracy;
  const latLng = [lat, lng];

  if (!userMarker) {
    userMarker = L.circleMarker(latLng, {
      radius: 8, fillColor: "#4285F4", color: "#ffffff", weight: 2, opacity: 1, fillOpacity: 1
    }).addTo(mapInstance);

    userMarker.bindPopup("Estás aquí").openPopup();

    accuracyCircle = L.circle(latLng, {
      radius: accuracy, color: "#4285F4", fillColor: "#4285F4", fillOpacity: 0.15, weight: 0
    }).addTo(mapInstance);

    // Primera vez: Vamos rápido a la ubicación del usuario
    mapInstance.flyTo(latLng, 18); 
  } else {
    // Actualizaciones: Solo movemos el marcador, no forzamos la vista si el usuario se movió
    userMarker.setLatLng(latLng);
    accuracyCircle.setLatLng(latLng);
    accuracyCircle.setRadius(accuracy);
    
    // Opcional: Si quieres que la cámara SIEMPRE siga al usuario, descomenta esto:
    // mapInstance.setView(latLng); 
  }
}

function manejarError(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  const btn = document.querySelector('.leaflet-control-gps');
  
  // Si falla, apagamos el botón visualmente
  if (btn && btn.classList.contains('activo')) {
    const icon = btn.querySelector('i');
    btn.classList.remove('activo');
    if (icon) icon.className = 'bx bx-crosshair';
    watchId = null; 
  }
  
  alert("⚠️ No se pudo obtener la ubicación o la señal es débil.");
}