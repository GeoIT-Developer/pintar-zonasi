'use client';

import API from '@/configs/api';
import useAPI from '@/hooks/useAPI';
import { getDateTimeString } from '@/utils/helper';
import { Toast } from 'primereact/toast';
import React, { useRef } from 'react';
import MapCard from './MapCard';
import BasemapProvider from '@/components/map/BasemapContext';
import { MapLibreProvider } from '@/components/map/MapLibreContext';
import { SekolahMetadataType } from '@/types/response/sekolah-metadata.interface';
import DataCard from './DataCard';

export default function SekolahDetailPage({ metadata_id }: { metadata_id: string }) {
    const toast = useRef<Toast>(null);

    const { data: detailData, ...apiGetDetail } = useAPI<SekolahMetadataType, string>(API.getListSekolahByMetadata, {
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

    function onRefresh() {
        apiGetDetail.call(metadata_id);
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Data Sekolah : {detailData?.name}</h5>
                    <p>{detailData?.description}</p>
                    <p>Diunggah Pada : {getDateTimeString(detailData?.created_at)}</p>
                </div>
            </div>

            <BasemapProvider>
                <MapLibreProvider triggerUserLocation={false}>
                    <MapCard detailData={detailData} />
                    <DataCard listData={detailData?.data || []} metadata_id={metadata_id} onRefresh={onRefresh} />
                </MapLibreProvider>
            </BasemapProvider>

            <Toast ref={toast} />
        </div>
    );
}
