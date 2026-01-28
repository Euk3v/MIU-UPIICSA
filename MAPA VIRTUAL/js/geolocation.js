let watchId = null;
let userMarker = null;
let accuracyCircle = null;
let mapInstance = null;

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
    // 🛑 DETENER
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
    console.log("🛑 Geolocalización detenida.");

  } else {
    // ▶️ INICIAR
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

    mapInstance.setView(latLng, 18);
  } else {
    userMarker.setLatLng(latLng);
    accuracyCircle.setLatLng(latLng);
    accuracyCircle.setRadius(accuracy);
  }
}

function manejarError(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  const btn = document.querySelector('.leaflet-control-gps');
  if (btn && btn.classList.contains('activo')) {
    btn.click(); // Desactivar si falla
  }
  alert("⚠️ No se pudo obtener la ubicación.");
}