export const esMovil = window.innerWidth <= 768;

const config = {
  center: [19.39595, -99.09163],
  zoom: 18,
  minZoom: 16,
  maxZoom: 25
};

let map = null;

export async function initMap() {
  if (map) return map;

  return new Promise((resolve, reject) => {
    const mapElement = document.getElementById('map');
    
    if (!mapElement) {
        console.error("❌ Error: Elemento #map no encontrado");
        reject("Elemento map no encontrado");
        return;
    }

    map = L.map('map', {
      zoomControl: !esMovil,
      ...config
    });

    if (!esMovil) {
      L.control.zoom({ position: 'topright' }).addTo(map);
    }

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; Carto',
      maxZoom: 25
    }).addTo(map);

    console.log("✅ Mapa inicializado");
    resolve(map);
  });
}