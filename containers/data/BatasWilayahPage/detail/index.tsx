'use client';

import API from '@/configs/api';
import useAPI from '@/hooks/useAPI';
import { BatasWilayahMetadataType } from '@/types/response/batas-wilayah-metadata.interface';
import { getDateTimeString } from '@/utils/helper';
import { Toast } from 'primereact/toast';
import React, { useRef } from 'react';
import MapCard from './MapCard';
import BasemapProvider from '@/components/map/BasemapContext';
import { MapLibreProvider } from '@/components/map/MapLibreContext';

export default function BatasWilayahDetailPage({ metadata_id }: { metadata_id: string }) {
    const toast = useRef<Toast>(null);

    const { data: detailData } = useAPI<BatasWilayahMetadataType, string>(API.getBatasWilayahDetail, {
        callOnFirstRender: true,
        callOnFirstRenderParams: metadata_id,

        onError: (err) => {
            toast.current?.show({
                severity: 'error',
                summary: 'Error!',
                detail: err,
                life: 3000,
            });
        },
    });

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5 className="mb-0">Data Batas Wilayah : {detailData?.name}</h5>
                    <p className="mb-0">{detailData?.description}</p>
                    <p className="mb-0">Diunggah Pada : {getDateTimeString(detailData?.created_at)}</p>
                </div>
            </div>

            <BasemapProvider>
                <MapLibreProvider triggerUserLocation={false}>
                    <MapCard metadata_id={metadata_id} detailData={detailData} />
                </MapLibreProvider>
            </BasemapProvider>

            <Toast ref={toast} />
        </div>
    );
}
