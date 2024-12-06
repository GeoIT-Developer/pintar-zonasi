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
};

function useLineLayer({ geojsonData, lineColor = '#FF6400', lineWidth = 3 }: Props) {
    const { myMap, mapStatus } = useMapLibreContext();

    const lineSetting = useRef(generateLayerId());

    useEffect(() => {
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

            map.addSource(geojsonSource, {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: getValObject(geojsonData, 'features', []),
                },
            });

            // ===================== Add LINE ========================================

            map.addLayer({
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
            });

            map.on('mouseenter', lineLayer, setCursorPointer);
            map.on('mouseleave', lineLayer, removeCursorPointer);
            map.on('click', lineLayer, onClickLayer);

            const bbox = getBboxFromGeojson(geojsonData);
            if (bbox) {
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
            }
        };
    }, [myMap, mapStatus, geojsonData, lineColor, lineWidth]);

    return lineSetting;
}

export default useLineLayer;
