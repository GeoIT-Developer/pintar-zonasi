import { useMapLibreContext } from '@/components/map/MapLibreContext';
import { BBOXType } from '@/types/bbox.type';
import LoadingState from '@/types/loading-state.enum';
import { ObjectLiteral } from '@/types/object-literal.interface';
import { generateRandomId, getValObject } from '@/utils';
import { propertiesTableDiv } from '@/utils/helper';
import MapLibreGL, { LngLatBoundsLike, Map, MapGeoJSONFeature, MapMouseEvent } from 'maplibre-gl';
import { useEffect, useRef } from 'react';

/*
Example :

    useWMTSLayer({
        bbox: bbox,
        layer: 'tb_batas_wilayah',
        workspace: 'zonasi',
        clickable: true,
        filter: ['==', ['get', 'file_metadata_id'], metadata_id],
    });

*/

function generateLayerId() {
    const uid = generateRandomId();
    const layerSource = `vector-layer-source-${uid}`;

    const wmtsLayer = `wmts-layer-${uid}`;
    return { uid, layerSource, wmtsLayer };
}

type WMSSettingType = {
    baseUrl?: string;
    layer: string;
    workspace: string;
    style?: string;
    filter?: MapLibreGL.FilterSpecification;
    bbox: BBOXType | null | undefined; // pass null if not want to use bbox
    clickable?: boolean;
};

const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_GEOSERVER_URL || '';

function useWMTSLayer({
    baseUrl = DEFAULT_BASE_URL,
    layer,
    filter,
    style,
    workspace,
    bbox,
    clickable,
}: WMSSettingType) {
    const { myMap, mapStatus } = useMapLibreContext();

    const layerSetting = useRef(generateLayerId());

    useEffect(() => {
        if (bbox === undefined) return;
        if (mapStatus !== LoadingState.SUCCESS) return;
        if (!layer || !workspace) return;

        const { layerSource, wmtsLayer } = layerSetting.current;

        const popup = new MapLibreGL.Popup({
            closeButton: true,
            closeOnClick: true,
            className: 'text-xl text-black font-bold !my-0',
        });

        const onClickLayer = (
            e: MapMouseEvent & {
                features?: MapGeoJSONFeature[] | undefined;
            } & Object,
        ) => {
            if (myMap) {
                const eFeature = e?.features;
                if (!eFeature?.length) return;
                const eProp: ObjectLiteral = eFeature[0].properties;
                const detailProp = JSON.parse(getValObject(eProp, 'properties', '{}'));

                popup.setLngLat(e.lngLat).setHTML(propertiesTableDiv(detailProp)).addTo(myMap);
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
                if (map.getLayer(wmtsLayer)) {
                    map.removeLayer(wmtsLayer);
                }
                if (map.getSource(layerSource)) {
                    map.removeSource(layerSource);
                }
            } catch (err) {}
        }

        const onMapLoad = (map: Map) => {
            const params = new URLSearchParams();
            params.set('service', 'WMTS');
            params.set('version', '1.0.0');
            params.set('request', 'GetTile');
            params.set('format', 'application/vnd.mapbox-vector-tile');
            params.set('TILEMATRIXSET', 'EPSG:900913');
            params.set('layer', `${workspace}:${layer}`);
            if (style) {
                params.set('style', style);
            }
            const wmtsUrl = `${baseUrl}${workspace}/gwc/service/wmts?${params.toString()}&TILEMATRIX=EPSG:900913:{z}&TILECOL={x}&TILEROW={y}`;

            cleanLayer(map);

            const srcSetting: MapLibreGL.SourceSpecification = {
                type: 'vector',
                tiles: [wmtsUrl],
                minzoom: 2,
                maxzoom: 20,
            };
            if (bbox) {
                srcSetting.bounds = bbox;
                map.addSource(layerSource, srcSetting);
            } else {
                map.addSource(layerSource, srcSetting);
            }

            const lyrSetting: MapLibreGL.AddLayerObject = {
                id: wmtsLayer,
                type: 'fill',
                source: layerSource,
                'source-layer': layer,
                paint: {
                    'fill-color': '#FF6400',
                    'fill-opacity': 0.3,
                    'fill-outline-color': '#088',
                },
            };
            if (filter) {
                lyrSetting.filter = filter;
                map.addLayer(lyrSetting);
            } else {
                map.addLayer(lyrSetting);
            }

            if (clickable) {
                map.on('click', wmtsLayer, onClickLayer);
                map.on('mouseenter', wmtsLayer, setCursorPointer);
                map.on('mouseleave', wmtsLayer, removeCursorPointer);
            }
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
                if (clickable) {
                    myMap.off('click', wmtsLayer, onClickLayer);
                    myMap.off('mouseenter', wmtsLayer, setCursorPointer);
                    myMap.off('mouseleave', wmtsLayer, removeCursorPointer);
                    cleanLayer(myMap);
                }
            }
        };
    }, [myMap, mapStatus, layer, filter, style, workspace, baseUrl, bbox, clickable]);

    return layerSetting;
}

export default useWMTSLayer;
