'use client';

import API from '@/configs/api';
import useAPI from '@/hooks/useAPI';
import { getDateTimeString } from '@/utils/helper';
import { Toast } from 'primereact/toast';
import React, { useRef } from 'react';
import MapCard from './MapCard';
import BasemapProvider from '@/components/map/BasemapContext';
import { MapLibreProvider } from '@/components/map/MapLibreContext';
import { getStatusSeverity, JalanMetadataType } from '@/types/response/jalan-metadata.interface';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { ObjectLiteral } from '@/types/object-literal.interface';

export default function JalanDetailPage({ metadata_id }: { metadata_id: string }) {
    const toast = useRef<Toast>(null);

    const { data: detailData, ...apiGetDetail } = useAPI<JalanMetadataType, string>(API.getJalanDetail, {
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

    const apiGenerateTopology = useAPI<ObjectLiteral, string>(API.putGenerateTopologyJalan, {
        onError: (err) => {
            toast.current?.show({
                severity: 'error',
                summary: 'Error!',
                detail: err,
                life: 3000,
            });
        },
        onSuccess: () => {
            apiGetDetail.call(metadata_id);
        },
    });

    function onClickGenerate() {
        toast.current?.show({
            severity: 'info',
            summary: 'Generating Topology...',
            life: 5000,
        });
        apiGenerateTopology.call(metadata_id);
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5 className="mb-0">Data Jalan : {detailData?.name}</h5>
                    <p className="mb-0">{detailData?.description}</p>
                    <p className="mb-0">Diunggah Pada : {getDateTimeString(detailData?.created_at)}</p>
                </div>
            </div>
            <div className="col-12">
                <DataTable value={detailData ? [detailData] : []}>
                    <Column field="road_table" header="Layer" />
                    <Column
                        field="data_status"
                        header="Data Status"
                        body={(row: JalanMetadataType) => {
                            const status = row.data_status;
                            return <Badge value={status} severity={getStatusSeverity(status)} />;
                        }}
                    />
                    <Column
                        field="geoserver_status"
                        header="Geoserver Status"
                        body={(row: JalanMetadataType) => {
                            const status = row.geoserver_status;
                            return <Badge value={status} severity={getStatusSeverity(status)} />;
                        }}
                    />
                    <Column
                        field="topology_status"
                        header="Topology Status"
                        body={(row: JalanMetadataType) => {
                            const status = row.topology_status;
                            return (
                                <div className="flex gap-2 align-items-center">
                                    {status && <Badge value={status} severity={getStatusSeverity(status)} />}
                                    {status !== 'CREATED' && (
                                        <Button
                                            size="small"
                                            icon="pi pi-sparkles"
                                            label="Generate"
                                            onClick={onClickGenerate}
                                            outlined
                                            disabled={
                                                apiGenerateTopology.loading ||
                                                detailData?.geoserver_status !== 'DEPLOYED'
                                            }
                                        />
                                    )}
                                </div>
                            );
                        }}
                    />
                </DataTable>
            </div>

            {detailData?.geoserver_status === 'DEPLOYED' && (
                <BasemapProvider>
                    <MapLibreProvider triggerUserLocation={false}>
                        <MapCard detailData={detailData} />
                    </MapLibreProvider>
                </BasemapProvider>
            )}

            <Toast ref={toast} />
        </div>
    );
}
