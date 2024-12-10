import { useMapLibreContext } from '@/components/map/MapLibreContext';
import LoadingState from '@/types/loading-state.enum';
import { ObjectLiteral } from '@/types/object-literal.interface';
import { generateRandomId, getValObject } from '@/utils';
import { getBboxFromGeojson, propertiesTableDiv } from '@/utils/helper';
import MapLibreGL, { LngLatBoundsLike, Map, MapGeoJSONFeature, MapMouseEvent } from 'maplibre-gl';
import { useEffect, useRef } from 'react';

function generateLayerId() {
    const uid = generateRandomId();
    const geojsonSource = `geojson-source-${uid}`;

    const lineLayer = `line-layer-${uid}`;
    return { uid, geojsonSource, lineLayer };
}
type Props = {
    geojsonData: ObjectLiteral;
    lineColor?: string;
    lineWidth?: number;
    show?: boolean;
    beforeLayer?: string;
    fitbounds?: boolean;
};

function useLineLayer({
    geojsonData,
    lineColor = '#FF6400',
    lineWidth = 3,
    show = true,
    beforeLayer,
    fitbounds = true,
}: Props) {
    const { myMap, mapStatus } = useMapLibreContext();

    const lineSetting = useRef(generateLayerId());

    useEffect(() => {
        if (!show) return;
        if (!geojsonData) return;
        if (mapStatus !== LoadingState.SUCCESS) return;
        const { geojsonSource, lineLayer } = lineSetting.current;

        const listLayer = [lineLayer];
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

            // ===================== Add LINE ========================================

            const layerProps: MapLibreGL.AddLayerObject = {
                id: lineLayer,
                type: 'line',
                source: geojsonSource,
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round',
                },
                paint: {
                    'line-color': lineColor,
                    'line-width': lineWidth,
                },
            };
            if (beforeLayer && map.getLayer(beforeLayer)) {
                map.addLayer(layerProps, beforeLayer);
            } else {
                map.addLayer(layerProps);
            }

            map.on('mouseenter', lineLayer, setCursorPointer);
            map.on('mouseleave', lineLayer, removeCursorPointer);
            map.on('click', lineLayer, onClickLayer);

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
                myMap.off('mouseenter', lineLayer, setCursorPointer);
                myMap.off('mouseleave', lineLayer, removeCursorPointer);
                myMap.off('click', lineLayer, onClickLayer);
                cleanLayer(myMap);
            }
        };
    }, [myMap, mapStatus, geojsonData, lineColor, lineWidth, show, beforeLayer, fitbounds]);

    return lineSetting;
}

export default useLineLayer;
