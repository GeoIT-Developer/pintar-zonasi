'use client';

import API from '@/configs/api';
import useAPI from '@/hooks/useAPI';
import { getDateTimeString } from '@/utils/helper';
import { Toast } from 'primereact/toast';
import React, { useRef } from 'react';
import MapCard from './MapCard';
import BasemapProvider from '@/components/map/BasemapContext';
import { MapLibreProvider } from '@/components/map/MapLibreContext';
import { PesertaDidikMetadataType } from '@/types/response/peserta-didik-metadata.interface';
import DataCard from './DataCard';

export default function PesertaDidikDetailPage({ metadata_id }: { metadata_id: string }) {
    const toast = useRef<Toast>(null);

    const { data: detailData } = useAPI<PesertaDidikMetadataType, string>(API.getPesertaDidikDetail, {
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

    const { data: detailPesertaDidikData, ...apiGetList } = useAPI<PesertaDidikMetadataType, string>(
        API.getListPesertaDidikByMetadata,
        {
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
        },
    );

    function onRefresh() {
        apiGetList.call(metadata_id);
    }

    const listData = detailPesertaDidikData?.data || [];

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5 className="mb-0">Data Peserta Didik : {detailData?.name}</h5>
                    <p className="mb-0">{detailData?.description}</p>
                    <p className="mb-0">Diunggah Pada : {getDateTimeString(detailData?.created_at)}</p>
                </div>
            </div>

            <BasemapProvider>
                <MapLibreProvider triggerUserLocation={false}>
                    <MapCard listData={listData} />
                    <DataCard
                        listData={listData}
                        metadata_id={metadata_id}
                        onRefresh={onRefresh}
                        loading={apiGetList.loading}
                    />
                </MapLibreProvider>
            </BasemapProvider>

            <Toast ref={toast} />
        </div>
    );
}
