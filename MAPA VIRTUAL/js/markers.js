const puntos = [
  { nombre: "Biblioteca", coords: [19.395, -99.095] },
  { nombre: "Auditorio", coords: [19.396, -99.096] },
  { nombre: "Cafetería", coords: [19.3955, -99.094] }
];

export const puntosBusqueda = [];

export function cargarMarcadores(map) {
  if (!map) return;
  puntosBusqueda.length = 0;

  puntos.forEach(p => {
    try {
      const marker = L.marker(p.coords)
        .bindPopup(`<strong>${p.nombre}</strong>`)
        .addTo(map);
      puntosBusqueda.push({ ...p, marker });
    } catch (error) {
      console.warn(`Error marcador: ${p.nombre}`);
    }
  });
  console.log(`📍 ${puntosBusqueda.length} marcadores cargados.`);
}