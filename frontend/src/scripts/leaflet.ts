import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// OpenStreetMap / GeoJSON
import osmtogeojson from 'osmtogeojson';

// Turf.js
import polygonize from '@turf/polygonize';
import { flattenEach } from '@turf/meta';
import { lineString, multiLineString, point, featureCollection } from '@turf/helpers';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import area from '@turf/area';


export async function initServiceMap() {
    const el = document.getElementById('service-map') as HTMLElement | null;
    if (!el) return;

    // Центр Минска
    const centerLat = 53.904541;
    const centerLng = 27.561523;

    // Создание карты
    const map = L.map(el, { scrollWheelZoom: false }).setView([centerLat, centerLng], 10);

    // Слой тайлов
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap',
    }).addTo(map);

    // Внешняя зона (МКАД + 15 км) — просто круг для ориентира
    const outer = L.circle([centerLat, centerLng], {
        radius: 15_000,
        color: '#e67e22',
        weight: 2,
        dashArray: '6,6',
        fillColor: '#e67e22',
        fillOpacity: 0.08,
    }).addTo(map).bindPopup('Зона за МКАД (платный выезд)');

    // Добавляем полигон МКАД
    const mkadLayer = await addMinskMKADPolygon(map, [centerLng, centerLat]);

    // Подгоняем вид
    if (mkadLayer) {
        const group = L.featureGroup([outer, mkadLayer]);
        map.fitBounds(group.getBounds(), { padding: [20, 20] });
    } else {
        map.fitBounds(outer.getBounds(), { padding: [20, 20] });
    }

    // Если контейнер был скрыт при инициализации
    setTimeout(() => map.invalidateSize(), 0);
}

const q = `
[out:json][timeout:60];
rel(176497);
way(r);
out geom;
`;

/**
 * Тянет линии МКАД из Overpass → polygonize → выбирает правильный полигон → рисует в Leaflet.
 */
async function addMinskMKADPolygon(map: L.Map, centerLngLat: [number, number]): Promise<L.GeoJSON | null> {
    const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(q);
    const resp = await fetch(url);
    if (!resp.ok) return null;

    const osmJson = await resp.json();
    const fc = osmtogeojson(osmJson) as GeoJSON.FeatureCollection;

    // 1) Собираем линии в LineString (polygonize любит именно набор линий)
    const lines: GeoJSON.Feature<GeoJSON.LineString>[] = [];
    flattenEach(fc as any, (feature: any) => {
        const geom = feature?.geometry;
        if (!geom) return;

        if (geom.type === 'LineString') {
            lines.push(lineString(geom.coordinates));
        } else if (geom.type === 'MultiLineString') {
            for (const part of geom.coordinates) {
                lines.push(lineString(part));
            }
        }
    });

    if (lines.length === 0) return null;

    // 2) polygonize: превращаем линии в полигоны
    const polyFC = polygonize(featureCollection(lines));

    // fallback: если не получилось
    if (!polyFC?.features?.length) {
        const mls =
            multiLineString(lines.map(l => l.geometry.coordinates));
        const polyFC2 = polygonize(mls);
        if (!polyFC2?.features?.length) return null;
        return paintBestPolygon(map, polyFC2, centerLngLat);
    }

    return paintBestPolygon(map, polyFC, centerLngLat);
}


function paintBestPolygon(
    map: L.Map,
    polyFC: GeoJSON.FeatureCollection,
    centerLngLat: [number, number],
): L.GeoJSON {
    const pt = point(centerLngLat);

    // 1) пробуем найти полигон, содержащий центр
    let chosen: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | null = null;
    for (const f of polyFC.features as any[]) {
        if (f.geometry && (f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon')) {
            if (booleanPointInPolygon(pt, f as any)) {
                chosen = f as any;
                break;
            }
        }
    }

    // 2) если не нашли — берём самый большой по площади
    if (!chosen) {
        let maxA = -1;
        for (const f of polyFC.features as any[]) {
            if (f.geometry && (f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon')) {
                const a = area(f as any);
                if (a > maxA) {
                    maxA = a;
                    chosen = f as any;
                }
            }
        }
    }

    // 3) Рисуем выбранный полигон
    const layer = L.geoJSON(chosen as any, {
        style: {
            color: '#5bbf3d',
            weight: 2,
            fillColor: '#5bbf3d',
            fillOpacity: 0.2,
        },
    }).addTo(map);

    layer.bindPopup('Зона в пределах МКАД (бесплатно)');
    return layer;
}
