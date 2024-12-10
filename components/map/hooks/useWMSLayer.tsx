import { useMapLibreContext } from '@/components/map/MapLibreContext';
import { BBOXType } from '@/types/bbox.type';
import LoadingState from '@/types/loading-state.enum';
import { generateRandomId, getValObject } from '@/utils';
import { isWithinBbox, propertiesTableDiv } from '@/utils/helper';
import MapLibreGL, { LngLatBoundsLike, Map, MapMouseEvent } from 'maplibre-gl';
import { useEffect, useRef } from 'react';

/*
Example :

    useWMSLayer({
        layers: 'tb_batas_wilayah',
        workspace: 'zonasi',
        cql_filter: `file_metadata_id=\'${metadata_id}\'`,
        styles: 'orange_polygon',
        bbox: bbox,
        clickable: true,
    });

*/

export function getWMSLayerUid(uid: string) {
    return `wms-layer-${uid}`;
}

function generateLayerId(id?: string | undefined) {
    const uid = id || generateRandomId();
    const layerSource = `raster-layer-source-${uid}`;

    const wmsLayer = `wms-layer-${uid}`;
    return { uid, layerSource, wmsLayer };
}

type WMSSettingType = {
    baseUrl?: string;
    layers: string;
    workspace: string;
    styles?: string;
    cql_filter?: string;
    bbox: BBOXType | null | undefined; // pass null if not want to use bbox
    clickable?: boolean;
    fitbounds?: boolean;
    uid?: string;
    beforeLayer?: string;
};

const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_GEOSERVER_URL || '';

function useWMSLayer({
    baseUrl = DEFAULT_BASE_URL,
    layers,
    cql_filter = '',
    styles,
    workspace,
    bbox,
    clickable,
    fitbounds = true,
    uid,
    beforeLayer,
}: WMSSettingType) {
    const { myMap, mapStatus } = useMapLibreContext();

    const layerSetting = useRef(generateLayerId(uid));

    useEffect(() => {
        if (bbox === undefined) return;
        if (mapStatus !== LoadingState.SUCCESS) return;
        if (!layers || !workspace) return;

        const { layerSource, wmsLayer } = layerSetting.current;

        const popup = new MapLibreGL.Popup({
            closeButton: true,
            closeOnClick: true,
            className: 'text-xl text-black font-bold !my-0',
        });

        function cleanLayer(map: Map) {
            try {
                if (map.getLayer(wmsLayer)) {
                    map.removeLayer(wmsLayer);
                }
                if (map.getSource(layerSource)) {
                    map.removeSource(layerSource);
                }
            } catch (err) {}
        }

        const onClickLayer = (e: MapMouseEvent) => {
            if (myMap) {
                if (bbox) {
                    if (!isWithinBbox(e.lngLat, bbox)) {
                        return;
                    }
                }

                const canvasBbox = myMap.getBounds();
                const canvasWidth = myMap.getCanvas().clientWidth;
                const canvasHeight = myMap.getCanvas().clientHeight;

                const params = new URLSearchParams();
                params.set('service', 'WMS');
                params.set('version', '1.1.1');
                params.set('request', 'GetFeatureInfo');
                params.set('srs', 'EPSG:4326');
                params.set('format', 'image/png');
                params.set('info_format', 'application/json');
                params.set('feature_count', '3');
                params.set('layers', `${workspace}:${layers}`);
                params.set('query_layers', `${workspace}:${layers}`);
                params.set('width', String(canvasWidth));
                params.set('height', String(canvasHeight));
                params.set(
                    'bbox',
                    `${canvasBbox.getWest()},${canvasBbox.getSouth()},${canvasBbox.getEast()},${canvasBbox.getNorth()}`,
                );
                params.set('x', String(Math.floor(e.point.x)));
                params.set('y', String(Math.floor(e.point.y)));

                const wmsUrl = `${baseUrl}${workspace}/wms?${params.toString()}&CQL_FILTER=${cql_filter}`;

                fetch(wmsUrl)
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.features.length > 0) {
                            const featureInfo = data.features[0].properties;
                            const eProps = JSON.parse(getValObject(featureInfo, 'properties', '{}'));
                            popup.setLngLat(e.lngLat).setHTML(propertiesTableDiv(eProps)).addTo(myMap);
                        } else {
                            popup.setLngLat(e.lngLat).setHTML('No feature found!').addTo(myMap);
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        };

        const onMapLoad = (map: Map) => {
            const params = new URLSearchParams();
            params.set('service', 'WMS');
            params.set('version', '1.1.1');
            params.set('request', 'GetMap');
            params.set('width', '256');
            params.set('height', '256');
            params.set('srs', 'EPSG:3857');
            params.set('transparent', 'true');
            params.set('format', 'image/png');
            params.set('layers', `${workspace}:${layers}`);
            if (styles) {
                params.set('styles', styles);
            }
            const wmsUrl = `${baseUrl}${workspace}/wms?${params.toString()}&bbox={bbox-epsg-3857}&CQL_FILTER=${cql_filter}`;

            cleanLayer(map);

            const srcSetting: MapLibreGL.SourceSpecification = {
                type: 'raster',
                tiles: [wmsUrl],
                tileSize: 256,
            };
            if (bbox) {
                srcSetting.bounds = bbox;
                map.addSource(layerSource, srcSetting);
            } else {
                map.addSource(layerSource, srcSetting);
            }
            const layerProps: MapLibreGL.AddLayerObject = {
                id: wmsLayer,
                type: 'raster',
                source: layerSource,
            };
            if (beforeLayer && map.getLayer(beforeLayer)) {
                map.addLayer(layerProps, beforeLayer);
            } else {
                map.addLayer(layerProps);
            }

            if (clickable) {
                map.on('click', onClickLayer);
            }
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
                if (clickable) {
                    myMap.off('click', onClickLayer);
                }
                cleanLayer(myMap);
            }
        };
    }, [myMap, mapStatus, layers, cql_filter, styles, workspace, baseUrl, bbox, clickable]);

    return layerSetting;
}

export default useWMSLayer;
