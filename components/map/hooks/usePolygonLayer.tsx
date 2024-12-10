import { useMapLibreContext } from '@/components/map/MapLibreContext';
import LoadingState from '@/types/loading-state.enum';
import { ObjectLiteral } from '@/types/object-literal.interface';
import { generateRandomId, getValObject } from '@/utils';
import { getBboxFromGeojson, propertiesTableDiv } from '@/utils/helper';
import MapLibreGL, { LngLatBoundsLike, Map, MapGeoJSONFeature, MapMouseEvent } from 'maplibre-gl';
import { useEffect, useRef } from 'react';

export function getPolygonLayerUid(uid: string) {
    return `polygon-layer-${uid}`;
}

function generateLayerId(id?: string | undefined) {
    const uid = id || generateRandomId();
    const geojsonSource = `geojson-source-${uid}`;

    const lineLayer = `line-layer-${uid}`;
    const polygonLayer = `polygon-layer-${uid}`;
    return { uid, geojsonSource, lineLayer, polygonLayer };
}

type Props = {
    geojsonData: ObjectLiteral;
    color?: string;
    fillColor?: string;
    fillOutlineColor?: string;
    fillOpacity?: number;
    lineColor?: string;
    lineWidth?: number;
    disableLine?: boolean;
    show?: boolean;
    fitbounds?: boolean;
    beforeLayer?: string;
    uid?: string;
};

function usePolygonLayer({
    geojsonData,
    color = '#FF6400',
    fillColor,
    fillOpacity = 0.3,
    fillOutlineColor,
    lineColor,
    lineWidth = 3,
    disableLine = false,
    show = true,
    fitbounds = true,
    beforeLayer,
    uid,
}: Props) {
    const { myMap, mapStatus } = useMapLibreContext();

    const polygonSetting = useRef(generateLayerId());

    useEffect(() => {
        if (!show) return;
        if (!geojsonData) return;
        if (mapStatus !== LoadingState.SUCCESS) return;
        const { geojsonSource, lineLayer, polygonLayer } = polygonSetting.current;

        const listLayer = [lineLayer, polygonLayer];
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

        function cleanLayer(map: Map) {
            try {
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
            } catch (err) {}
        }

        const onMapLoad = (map: Map) => {
            cleanLayer(map);

            map.addSource(geojsonSource, {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: getValObject(geojsonData, 'features', []),
                },
            });

            // ===================== Add POLYGON ========================================
            const layerProps: MapLibreGL.AddLayerObject = {
                id: polygonLayer,
                type: 'fill',
                source: geojsonSource,
                paint: {
                    'fill-color': fillColor || color,
                    'fill-opacity': fillOpacity,
                    'fill-outline-color': fillOutlineColor || color,
                },
            };
            if (beforeLayer && map.getLayer(beforeLayer)) {
                map.addLayer(layerProps, beforeLayer);
            } else {
                map.addLayer(layerProps);
            }

            // ===================== Add LINE ========================================

            if (!disableLine) {
                map.addLayer({
                    id: lineLayer,
                    type: 'line',
                    source: geojsonSource,
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round',
                    },
                    paint: {
                        'line-color': lineColor || color,
                        'line-width': lineWidth,
                    },
                });
            }

            map.on('mouseenter', polygonLayer, setCursorPointer);
            map.on('mouseleave', polygonLayer, removeCursorPointer);
            map.on('click', polygonLayer, onClickLayer);

            const bbox = getBboxFromGeojson(geojsonData);
            if (bbox && fitbounds) {
                map.fitBounds(bbox as LngLatBoundsLike);
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
                myMap.off('mouseenter', polygonLayer, setCursorPointer);
                myMap.off('mouseleave', polygonLayer, removeCursorPointer);
                myMap.off('click', polygonLayer, onClickLayer);
                cleanLayer(myMap);
            }
        };
    }, [
        myMap,
        mapStatus,
        geojsonData,
        fillColor,
        color,
        fillOpacity,
        fillOutlineColor,
        disableLine,
        lineColor,
        lineWidth,
        show,
        fitbounds,
        beforeLayer,
    ]);

    return polygonSetting;
}

export default usePolygonLayer;
