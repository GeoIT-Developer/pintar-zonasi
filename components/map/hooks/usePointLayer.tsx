import { useMapLibreContext } from '@/components/map/MapLibreContext';
import LoadingState from '@/types/loading-state.enum';
import { ObjectLiteral } from '@/types/object-literal.interface';
import { generateRandomId, getValObject } from '@/utils';
import { getBboxFromPointFeatures, propertiesTableDiv } from '@/utils/helper';
import MapLibreGL, { LngLatBoundsLike, Map, MapGeoJSONFeature, MapMouseEvent } from 'maplibre-gl';
import { useEffect, useRef } from 'react';

function generateLayerId() {
    const uid = generateRandomId();
    const geojsonSource = `geojson-source-${uid}`;

    const symbolLayer = `symbol-layer-${uid}`;
    const pointLayer = `point-layer-${uid}`;
    return { uid, geojsonSource, symbolLayer, pointLayer };
}

type Props = {
    jsonData: ObjectLiteral[];
    label?: string;
    fitbounds?: boolean;
};

function usePointLayer({ jsonData, label, fitbounds = true }: Props) {
    const { myMap, mapStatus } = useMapLibreContext();

    const pointSetting = useRef(generateLayerId());

    useEffect(() => {
        if (!Array.isArray(jsonData)) return;
        if (mapStatus !== LoadingState.SUCCESS) return;
        const { geojsonSource, pointLayer, symbolLayer } = pointSetting.current;

        const listLayer = [pointLayer, symbolLayer];
        const listSource = [geojsonSource];

        const popup = new MapLibreGL.Popup({
            closeButton: false,
            closeOnClick: true,
            className: 'text-xl text-black font-bold !my-0',
        });

        const onClickLayer = (
            e: MapMouseEvent & {
                features?: MapGeoJSONFeature[] | undefined;
            } & Object,
        ) => {
            if (myMap) {
                myMap.getCanvas().style.cursor = 'pointer';
                const eFeature = e?.features;
                if (!eFeature?.length) return;

                popup.setLngLat(e.lngLat).setHTML(propertiesTableDiv(eFeature[0].properties)).addTo(myMap);
            }
        };
        const setCursorPointer = () => {
            if (myMap) {
                myMap.getCanvas().style.cursor = 'pointer';
            }
        };
        const removeCursorPointer = () => {
            if (myMap) {
                myMap.getCanvas().style.cursor = '';
            }
        };

        const onMapLoad = (map: Map) => {
            listLayer.forEach((layer) => {
                if (map.getLayer(layer)) {
                    map.removeLayer(layer);
                }
            });
            listSource.forEach((src) => {
                if (map.getSource(src)) {
                    map.removeSource(src);
                }
            });

            const pointFeatures: {
                type: 'Feature';
                geometry: {
                    type: 'Point';
                    coordinates: [number, number];
                };
                properties: ObjectLiteral;
            }[] = [];

            jsonData.forEach((item) => {
                const lat = Number(getValObject(item, 'lat', 0));
                const lon = Number(getValObject(item, 'lon', 0));
                if (lat && lon) {
                    pointFeatures.push({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [lon, lat],
                        },
                        properties: item,
                    });
                }
            });

            map.addSource(geojsonSource, {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: pointFeatures,
                },
            });

            // ===================== Add POINT ========================================

            map.addLayer({
                id: pointLayer,
                type: 'circle',
                source: geojsonSource,
                paint: {
                    'circle-color': '#0079ed',
                    'circle-radius': 4,
                    'circle-stroke-color': 'white',
                    'circle-stroke-width': 2,
                },
            });

            if (label) {
                // ===================== Add SYMBOL ========================================

                map.addLayer({
                    id: symbolLayer,
                    type: 'symbol',
                    source: geojsonSource,
                    layout: {
                        'text-field': ['get', label],
                        'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
                        'text-radial-offset': 0.5,
                        'text-justify': 'auto',
                        'text-size': 12,
                    },
                    paint: {
                        'text-color': 'black',
                        'text-halo-color': 'white',
                        'text-halo-width': 2,
                    },
                });
            }

            map.on('mouseenter', pointLayer, setCursorPointer);
            map.on('mouseleave', pointLayer, removeCursorPointer);
            map.on('click', pointLayer, onClickLayer);
            if (fitbounds) {
                const bbox = getBboxFromPointFeatures(pointFeatures);
                if (bbox) {
                    map.fitBounds(bbox as LngLatBoundsLike);
                }
            }
        };

        if (myMap) {
            const checkIfLoaded = () => {
                if (myMap.isStyleLoaded()) {
                    onMapLoad(myMap);
                } else {
                    setTimeout(checkIfLoaded, 100);
                }
            };
            checkIfLoaded();
        }
        return () => {
            if (myMap) {
                myMap.off('mouseenter', pointLayer, setCursorPointer);
                myMap.off('mouseleave', pointLayer, removeCursorPointer);
                myMap.off('click', pointLayer, onClickLayer);
            }
        };
    }, [myMap, mapStatus, jsonData, label, fitbounds]);

    return pointSetting;
}

export default usePointLayer;
