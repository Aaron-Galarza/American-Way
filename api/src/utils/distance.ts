import { AppError } from './AppError';

const getStoreCoordinates = () => {
  const storeLat = Number(process.env.STORE_LAT);
  const storeLng = Number(process.env.STORE_LNG);

  if (!Number.isFinite(storeLat) || !Number.isFinite(storeLng)) {
    throw new AppError(500, 'Faltan las coordenadas del local');
  }

  return { storeLat, storeLng };
};

export const calculateDistanceKm = async (clientLat: number, clientLng: number): Promise<number> => {
  const token = process.env.MAPBOX_TOKEN;
  if (!token) {
    throw new AppError(500, 'Falta MAPBOX_TOKEN en el servidor');
  }

  const { storeLat, storeLng } = getStoreCoordinates();
  const url = new URL(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${storeLng},${storeLat};${clientLng},${clientLat}`,
  );

  url.searchParams.set('access_token', token);
  url.searchParams.set('geometries', 'geojson');
  url.searchParams.set('overview', 'false');

  let response: Response;
  try {
    response = await fetch(url);
  } catch (error) {
    throw new AppError(503, 'No se pudo consultar el servicio de mapas');
  }

  if (!response.ok) {
    throw new AppError(503, 'No se pudo calcular la distancia de envio');
  }

  const data = await response.json();
  const distanceMeters = data?.routes?.[0]?.distance;

  if (typeof distanceMeters !== 'number') {
    throw new AppError(400, 'No se encontro una ruta valida para esas coordenadas');
  }

  return Math.round((distanceMeters / 1000) * 100) / 100;
};
