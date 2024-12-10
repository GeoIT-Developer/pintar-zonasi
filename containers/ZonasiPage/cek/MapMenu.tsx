import { useMapLibreContext } from '@/components/map/MapLibreContext';
import { Button } from 'primereact/button';
import React, { useEffect, useState } from 'react';
import MapLibreGL from 'maplibre-gl';
import useAPI from '@/hooks/useAPI';
import { ObjectLiteral } from '@/types/object-literal.interface';
import API from '@/configs/api';
import usePolygonLayer from '@/components/map/hooks/usePolygonLayer';
import { getPointLayerUid } from '@/components/map/hooks/usePointLayer';
import { getValObject } from '@/utils';
import { useToastContext } from '@/layout/context/ToastContext';
import useLineLayer from '@/components/map/hooks/useLineLayer';
import { ProgressSpinner } from 'primereact/progressspinner';
import { LayerSettingType } from '@/types/layer.type';
import { DataType } from '@/utils/constant';
import { ZonasiResponseType } from '@/types/response/zonasi.interface';

type CoordType = { lat: number; lon: number };

function getIsochroneAndReverse(geojson: ObjectLiteral) {
    const features = getValObject(geojson, 'features', []) as ObjectLiteral[];
    return {
        type: 'FeatureCollection',
        features: [...features].reverse(),
    };
}

type Props = { metadata_id: string; listLayer: LayerSettingType[]; onResult: (res: ZonasiResponseType) => void };

export default function MapMenu({ metadata_id, listLayer, onResult }: Props) {
    const toast = useToastContext();
    const { myMap } = useMapLibreContext();
    const [startZonasi, setStartZonasi] = useState(false);
    const [myCoordinate, setMyCoordinate] = useState<CoordType>({
        lat: 0,
        lon: 0,
    });
    const [beforeLayer, setBeforeLayer] = useState('');
    const [zonasiData, setZonasiData] = useState<ZonasiResponseType>();

    const apiMyZonasi = useAPI<ZonasiResponseType, CoordType & { id: string }>(API.getMyZonasi, {
        onError: (err) => {
            toast.current?.show({
                severity: 'error',
                summary: 'Error!',
                detail: err,
                life: 3000,
            });
        },
        onSuccess: (_raw, res) => {
            const eData = res?.data;
            setZonasiData(eData);
            onResult(eData);
        },
    });

    useEffect(() => {
        if (!startZonasi) return;
        if (!myMap) return;

        const center = myMap.getCenter();
        const centerCoor: [number, number] = [center.lng, center.lat];

        const marker = new MapLibreGL.Marker({ draggable: true }).setLngLat(centerCoor).addTo(myMap);
        setMyCoordinate({
            lat: center.lat,
            lon: center.lng,
        });

        function onDragEnd() {
            const lngLat = marker.getLngLat();
            const coor = { lat: lngLat.lat, lon: lngLat.lng };
            setMyCoordinate(coor);
        }

        marker.on('dragend', onDragEnd);
        return () => {
            if (myMap) {
                if (marker) {
                    marker.off('dragend', onDragEnd);
                    marker.remove();
                }
            }
        };
    }, [myMap, startZonasi]);

    function onClickZonasi() {
        apiMyZonasi.clearData();
        setStartZonasi(!startZonasi);
    }

    function onClickStartZonasi() {
        apiMyZonasi.call({ id: metadata_id, ...myCoordinate });
        toast.current?.show({
            severity: 'info',
            summary: 'Memproses...',
            life: 15000,
        });
    }

    useEffect(() => {
        if (listLayer.length) {
            const eFind = listLayer.findLast((item) => item.show && item.type === DataType.SEKOLAH);
            if (eFind) {
                setBeforeLayer(getPointLayerUid(eFind.id));
            }
        } else {
            setBeforeLayer('');
        }
    }, [listLayer]);

    usePolygonLayer({
        geojsonData: getIsochroneAndReverse(zonasiData?.isochrone || {}),
        color: 'yellowgreen',
        fillOpacity: 0.1,
        lineWidth: 1,
        lineColor: 'darkgreen',
        fitbounds: false,
        beforeLayer: beforeLayer,
    });
    useLineLayer({
        geojsonData: zonasiData?.route || {},
        lineColor: 'steelblue',
        lineWidth: 3,
        beforeLayer: beforeLayer,
        fitbounds: false,
    });

    return (
        <div className="absolute top-0 left-0 z-5 p-2 bg-white-alpha-60 block text-center">
            {!startZonasi && (
                <div className="block w-full">
                    <Button label="Cek Zonasi" className="w-full" icon="pi pi-asterisk" onClick={onClickZonasi} />
                </div>
            )}

            {startZonasi && !apiMyZonasi.loading && (
                <div className="block w-full">
                    <Button
                        label="Batal"
                        size="small"
                        severity="secondary"
                        className="w-full mb-1"
                        onClick={onClickZonasi}
                        outlined
                        icon="pi pi-times"
                    />
                    <br />
                    <Button
                        label="Start Process"
                        size="small"
                        severity="success"
                        className="w-full"
                        icon="pi pi-send"
                        onClick={onClickStartZonasi}
                        disabled={apiMyZonasi.loading}
                    />
                </div>
            )}
            {apiMyZonasi.loading && <ProgressSpinner style={{ width: '75px', height: '75px' }} strokeWidth="5" />}
        </div>
    );
}
