import { ObjectLiteral } from '@/types/object-literal.interface';
import { SpatialFileEnum } from '@/types/spatial-file.enum';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
// @ts-ignore
import toGeoJSON from '@mapbox/togeojson';
import shp from 'shpjs';
import Maplibregl, { LngLatLike, MapGeoJSONFeature, MapMouseEvent } from 'maplibre-gl';
import * as turf from '@turf/turf';
import { BBOXType } from '@/types/bbox.type';
import Papa from 'papaparse';

dayjs.extend(customParseFormat);

export const getDateTimeString = (eDate: string | null | undefined): string => {
    if (!eDate) return '';
    const inputDate = dayjs(eDate).format('YYYY-MM-DD HH:mm:ss');
    return inputDate;
};

export const formatDate = (
    eDate: Date | string | null | undefined,
    { from, to }: { from?: string; to: string },
): string => {
    if (!eDate) return '';
    const inputDate = dayjs(eDate, from).format(to);
    return inputDate;
};

export const getSpatialFileType = (file: File): SpatialFileEnum | null => {
    if (!file) return null;
    const validExtensions = [SpatialFileEnum.ZIP, SpatialFileEnum.KML, SpatialFileEnum.GEOJSON];

    // Get the file extension by splitting the filename and converting it to lowercase
    const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase() as SpatialFileEnum;
    if (validExtensions.includes(fileExtension)) {
        return fileExtension;
    }
    return null;
};

export async function readGeojsonFile(inputFile: File): Promise<ObjectLiteral> {
    return new Promise((resolve, reject) => {
        if (inputFile && inputFile.name.endsWith('.geojson')) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const fileContent = e.target?.result as string;

                try {
                    // Parse the GeoJSON file content
                    const geoJson = JSON.parse(fileContent);
                    resolve(geoJson);
                } catch (error) {
                    reject(error);
                }
            };

            // Read the file as text
            reader.readAsText(inputFile);
        } else {
            reject('Please upload a valid .geojson file.');
        }
    });
}

export async function readKmlFile(inputFile: File): Promise<ObjectLiteral> {
    return new Promise((resolve, reject) => {
        if (inputFile && inputFile.name.endsWith('.kml')) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const fileContent = e.target?.result as string;

                try {
                    const parser = new DOMParser();
                    const kml = parser.parseFromString(fileContent, 'application/xml');

                    // Convert the KML to GeoJSON using togeojson library
                    const geoJson = toGeoJSON.kml(kml);
                    resolve(geoJson);
                } catch (error) {
                    reject(error);
                }
            };

            // Read the file as text
            reader.readAsText(inputFile);
        } else {
            reject('Please upload a valid .kml file.');
        }
    });
}

export async function readShpInZipFile(inputFile: File): Promise<ObjectLiteral> {
    return new Promise(async (resolve, reject) => {
        if (inputFile && inputFile.name.endsWith('.zip')) {
            try {
                const resData = await inputFile.arrayBuffer();
                const geoJson = await shp(resData);
                resolve(geoJson);
            } catch (error) {
                reject(error);
            }
        } else {
            reject('Please upload a valid .zip file.');
        }
    });
}

export const getGeojsonData = (inputFile: File): Promise<ObjectLiteral> => {
    return new Promise(async (resolve, reject) => {
        try {
            const spatialFile = getSpatialFileType(inputFile);

            if (spatialFile === SpatialFileEnum.GEOJSON) {
                const geojsonData = await readGeojsonFile(inputFile);
                resolve(geojsonData);
            } else if (spatialFile === SpatialFileEnum.KML) {
                const kmlData = await readKmlFile(inputFile);
                resolve(kmlData);
            } else if (spatialFile === SpatialFileEnum.ZIP) {
                const shpData = await readShpInZipFile(inputFile);
                resolve(shpData);
            } else {
                reject(new Error('Invalid spatial filetype'));
            }
        } catch (error) {
            reject(error);
        }
    });
};

export function getMapLibreCoordinate(
    e: MapMouseEvent & {
        features?: MapGeoJSONFeature[] | undefined;
    } & Object,
) {
    if (!e.features) return;
    // @ts-ignore
    const coordinates = e.features[0].geometry.coordinates.slice();
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    return {
        coordinates,
        properties: e.features[0].properties,
    };
}

export const extractLabelValueFromObj = (obj: Record<string, any>): any => {
    // List of prioritized keys to search for
    const preferredKeys = ['name', 'nama', 'nameobj', 'id', 'fid', 'objectid', 'description'];

    // Check if the object contains any of the preferred keys and return the corresponding non-falsy value
    for (const key of preferredKeys) {
        if (key in obj && obj[key]) {
            return obj[key]; // Return the value of the found key if it's not falsy
        }
    }

    // If none of the preferred keys are found, return the first non-falsy value from the object
    const firstNonFalsyKey = Object.keys(obj).find((key) => obj[key]); // Find the first key with a non-falsy value
    return firstNonFalsyKey ? obj[firstNonFalsyKey] : undefined;
};

export function propertiesTableDiv(props: ObjectLiteral) {
    const listRow: string[] = [];

    for (const key in props) {
        if (key === 'WKT_GEOMETRY' || key === 'ogc_fid') continue;
        if (props.hasOwnProperty(key)) {
            const row = `<tr style='${listRow.length % 2 === 0 ? 'background-color: #dddddd' : ''}'>
            <td>${key}</td>
            <td style='word-break: break-all'>${props[key]}</td>
          </tr>`;
            listRow.push(row);
        }
    }

    return `<table style='border: 1px solid #dddddd'>${listRow.join('')}</table>`;
}

export const getPolygonBoundingBox = (polygon: ObjectLiteral) => {
    const coordinates: [LngLatLike, LngLatLike][] = polygon[0];
    const bounds = coordinates.reduce(function (bounds, coord) {
        return bounds.extend(coord);
        // @ts-ignore
    }, new Maplibregl.LngLatBounds(coordinates[0], coordinates[0]));
    return bounds;
};

export function getBboxFromGeojson(geojsonData: ObjectLiteral) {
    if (!geojsonData) return null;
    try {
        const bbox = turf.bbox(geojsonData as turf.AllGeoJSON);
        return bbox;
    } catch (err) {
        return null;
    }
}

export function getBboxFromPointFeatures(pointFeatures: ObjectLiteral[]): [number, number, number, number] | null {
    if (pointFeatures.length === 0) {
        return null; // No points, no bounding box
    }

    let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;

    for (const feature of pointFeatures) {
        const [x, y] = feature.geometry.coordinates;

        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
    }

    return [minX, minY, maxX, maxY];
}

export const isWithinBbox = (lngLat: { lng: number; lat: number }, bbox: BBOXType) => {
    return lngLat.lng >= bbox[0] && lngLat.lng <= bbox[2] && lngLat.lat >= bbox[1] && lngLat.lat <= bbox[3];
};

export function cleanCSVRow(eData: ObjectLiteral[]): ObjectLiteral[] {
    return eData.filter((row) => {
        return Object.values(row).some((value) => value.trim() !== '');
    });
}

export async function csvFileToJson(eFile: File): Promise<ObjectLiteral[]> {
    return new Promise((resolve, reject) => {
        Papa.parse(eFile, {
            header: true,
            complete: (results) => {
                const eData = results.data;
                if (Array.isArray(eData) && eData.length > 0) {
                    const cleanData = cleanCSVRow(eData as ObjectLiteral[]);
                    resolve(cleanData);
                } else {
                    reject('No data found!');
                }
            },
            error(error) {
                reject(error);
            },
        });
    });
}

export function concaveHullGeojson(feature: ObjectLiteral) {
    const vertices = turf.coordAll(feature as turf.AllGeoJSON);
    const points = turf.featureCollection(vertices.map((coord) => turf.point(coord)));

    const hull = turf.concave(points, { units: 'kilometers', maxEdge: 0.5 });
    return hull;
}

export function arrayToTableString(arr: ObjectLiteral[]) {
    if (arr.length === 0) return '';

    // Get the headers from the keys of the first object
    const headers = Object.keys(arr[0]);

    // Create the header row as a string
    let tableString = headers.join('\t') + '\n';

    // Create data rows
    arr.forEach((item) => {
        const row = headers.map((header) => item[header]).join('\t');
        tableString += row + '\n';
    });

    return tableString.trim(); // Remove trailing new line
}
