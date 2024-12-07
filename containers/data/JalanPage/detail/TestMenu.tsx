import { useMapLibreContext } from '@/components/map/MapLibreContext';
import { JalanMetadataType } from '@/types/response/jalan-metadata.interface';
import { Button } from 'primereact/button';
import React, { useEffect, useState } from 'react';
import MapLibreGL, { Popup } from 'maplibre-gl';
import useAPI from '@/hooks/useAPI';
import { ObjectLiteral } from '@/types/object-literal.interface';
import API from '@/configs/api';
import { InputText } from 'primereact/inputtext';
import usePolygonLayer from '@/components/map/hooks/usePolygonLayer';
import usePointLayer from '@/components/map/hooks/usePointLayer';
import { getValObject } from '@/utils';
import { useToastContext } from '@/layout/context/ToastContext';
import useLineLayer from '@/components/map/hooks/useLineLayer';

type CoordType = { lat: number; lon: number };
type RoutingType = {
    start: CoordType;
    end: CoordType;
};

export default function TestMenu({ detailData }: { detailData: JalanMetadataType }) {
    const toast = useToastContext();
    const { myMap, mapStatus } = useMapLibreContext();
    const [startRouting, setStartRouting] = useState(false);
    const [startIsochrone, setStartIsochrone] = useState(false);
    const [routingCoordinate, setRoutingCoordinate] = useState<RoutingType>({
        start: { lat: 0, lon: 0 },
        end: { lat: 0, lon: 0 },
    });
    const [isochroneCoordinate, setIsochroneCoordinate] = useState<CoordType>({
        lat: 0,
        lon: 0,
    });
    const [isoTime, setIsoTime] = useState<number>(30);
    const [listPoint, setListPoint] = useState<ObjectLiteral[]>([]);

    const apiRouting = useAPI<ObjectLiteral, RoutingType & { id: string }>(API.getRoutingJalan, {
        onError: (err) => {
            toast.current?.show({
                severity: 'error',
                summary: 'Error!',
                detail: err,
                life: 3000,
            });
        },
    });
    const apiIsochrone = useAPI<ObjectLiteral, CoordType & { id: string; time: number }>(API.getIsochroneJalan, {
        onError: (err) => {
            toast.current?.show({
                severity: 'error',
                summary: 'Error!',
                detail: err,
                life: 3000,
            });
        },
    });

    useEffect(() => {
        if (!startRouting) return;
        if (!myMap) return;

        const center = myMap.getCenter();
        const centerCoor: [number, number] = [center.lng, center.lat];

        const startMarkerCoor: [number, number] = routingCoordinate.start.lon
            ? [routingCoordinate.start.lon, routingCoordinate.start.lat]
            : centerCoor;
        const startMarker = new MapLibreGL.Marker({ draggable: true })
            .setLngLat(startMarkerCoor)
            .setPopup(new Popup({ closeOnClick: false, closeButton: false }).setHTML('<b>Start Point</b>'))
            .addTo(myMap);
        startMarker.togglePopup();

        const endMarkerCoor: [number, number] = routingCoordinate.end.lon
            ? [routingCoordinate.end.lon, routingCoordinate.end.lat]
            : centerCoor;
        const endMarker = new MapLibreGL.Marker({ draggable: true })
            .setLngLat(endMarkerCoor)
            .setPopup(new Popup({ closeOnClick: false, closeButton: false }).setHTML('<b>End Point</b>'))
            .addTo(myMap);
        endMarker.togglePopup();

        setRoutingCoordinate({
            start: { lat: startMarkerCoor[1], lon: startMarkerCoor[0] },
            end: { lat: endMarkerCoor[1], lon: endMarkerCoor[0] },
        });

        function onDragEndStart() {
            const lngLat = startMarker.getLngLat();
            const coor = { lat: lngLat.lat, lon: lngLat.lng };
            setRoutingCoordinate((oldState) => {
                return { ...oldState, start: coor };
            });
        }
        function onDragEndEnd() {
            const lngLat = endMarker.getLngLat();
            const coor = { lat: lngLat.lat, lon: lngLat.lng };
            setRoutingCoordinate((oldState) => {
                return { ...oldState, end: coor };
            });
        }

        startMarker.on('dragend', onDragEndStart);
        endMarker.on('dragend', onDragEndEnd);
        return () => {
            if (myMap) {
                if (startMarker) {
                    startMarker.off('dragend', onDragEndStart);
                    startMarker.remove();
                }
                if (endMarker) {
                    endMarker.off('dragend', onDragEndEnd);
                    endMarker.remove();
                }
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [myMap, startRouting]);

    useEffect(() => {
        if (!startIsochrone) return;
        if (!myMap) return;

        const center = myMap.getCenter();
        const centerCoor: [number, number] = [center.lng, center.lat];

        const marker = new MapLibreGL.Marker({ draggable: true }).setLngLat(centerCoor).addTo(myMap);
        setIsochroneCoordinate({
            lat: center.lat,
            lon: center.lng,
        });

        function onDragEnd() {
            const lngLat = marker.getLngLat();
            const coor = { lat: lngLat.lat, lon: lngLat.lng };
            setIsochroneCoordinate(coor);
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
    }, [myMap, startIsochrone]);

    function onClickTestRouting() {
        apiRouting.clearData();
        setStartRouting(!startRouting);
    }
    function onClickTestIsochrone() {
        apiIsochrone.clearData();
        setListPoint([]);
        setStartIsochrone(!startIsochrone);
    }

    function onClickStartRouting() {
        apiRouting.call({ id: detailData.id, ...routingCoordinate });
        toast.current?.show({
            severity: 'info',
            summary: 'Mencari rute...',
            life: 5000,
        });
    }
    function onClickStartIsochrone() {
        apiIsochrone.call({ id: detailData.id, time: isoTime, ...isochroneCoordinate });
        toast.current?.show({
            severity: 'info',
            summary: 'Memproses...',
            life: 5000,
        });
    }

    usePolygonLayer({ geojsonData: apiIsochrone.data || {} });
    usePointLayer({ jsonData: listPoint, fitbounds: false, label: 'idx' });
    useLineLayer({ geojsonData: apiRouting.data || {}, lineColor: 'cyan', lineWidth: 5 });

    useEffect(() => {
        const eData = apiIsochrone.data;
        if (!eData) return;
        const features: ObjectLiteral[] = getValObject(eData, 'features', []);
        const eList: { lat: number; lon: number }[] = [];
        features.forEach((item) => {
            const isPoint = getValObject(item, 'geometry.type', '');
            if (isPoint === 'Point') {
                const coor = getValObject(item, 'geometry.coordinates', [0, 0]);
                const props = getValObject(item, 'properties', {});
                eList.push({ lat: coor[1], lon: coor[0], ...props });
            }
        });
        setListPoint(eList);
    }, [apiIsochrone.data]);

    return (
        <div className="absolute top-0 left-0 z-5 p-2 bg-white-alpha-60 block text-center">
            {!startRouting && !startIsochrone && (
                <div className="block w-full">
                    <Button
                        label="Test Routing"
                        size="small"
                        severity="info"
                        className="w-full mb-1"
                        onClick={onClickTestRouting}
                        icon="pi pi-arrow-up-right"
                    />
                    <br />
                    <Button
                        label="Test Isochrone"
                        size="small"
                        severity="help"
                        className="w-full"
                        icon="pi pi-asterisk"
                        onClick={onClickTestIsochrone}
                    />
                </div>
            )}
            {startRouting && (
                <div className="block w-full">
                    <Button
                        label="Batal"
                        size="small"
                        severity="secondary"
                        className="w-full mb-1"
                        onClick={onClickTestRouting}
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
                        onClick={onClickStartRouting}
                        disabled={apiRouting.loading}
                    />
                </div>
            )}
            {startIsochrone && (
                <div className="block w-full">
                    <Button
                        label="Batal"
                        size="small"
                        severity="secondary"
                        className="w-full mb-1"
                        onClick={onClickTestIsochrone}
                        outlined
                        icon="pi pi-times"
                    />
                    <br />
                    <InputText
                        type="number"
                        placeholder="-- Waktu (m) --"
                        value={String(isoTime)}
                        onChange={(e) => {
                            const eVal = Number(e.target.value);
                            setIsoTime(eVal);
                        }}
                        className="mb-1"
                        style={{ width: '8rem' }}
                    />
                    <br />
                    <Button
                        label="Start Process"
                        size="small"
                        severity="success"
                        className="w-full"
                        icon="pi pi-send"
                        onClick={onClickStartIsochrone}
                        disabled={apiIsochrone.loading}
                    />
                </div>
            )}
        </div>
    );
}
