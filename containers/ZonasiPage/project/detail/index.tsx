'use client';

import API from '@/configs/api';
import useAPI from '@/hooks/useAPI';
import { getDateTimeString } from '@/utils/helper';
import React from 'react';
import BasemapProvider from '@/components/map/BasemapContext';
import { MapLibreProvider } from '@/components/map/MapLibreContext';
import { ProjectMetadataType } from '@/types/response/project-metadata.interface';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ObjectLiteral } from '@/types/object-literal.interface';
import { useToastContext } from '@/layout/context/ToastContext';
import ContentSection from './ContentSection';
import { SelectButton } from 'primereact/selectbutton';

export default function ProjectDetailPage({ metadata_id }: { metadata_id: string }) {
    const toast = useToastContext();

    const { data: detailData, ...apiGetDetail } = useAPI<ProjectMetadataType, string>(API.getProjectDetail, {
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

    const apiUpdateStatus = useAPI<ObjectLiteral, { id: string; status: string }>(API.putUpdateStatusProject, {
        onError: (err) => {
            toast.current?.show({
                severity: 'error',
                summary: 'Error!',
                detail: err,
                life: 3000,
            });
        },
        onSuccess: () => {
            toast.current?.show({
                severity: 'success',
                summary: 'Status updated!',
                life: 3000,
            });
            onRefresh();
        },
    });

    function onRefresh() {
        apiGetDetail.call(metadata_id);
    }

    function onClickChangeStatus(status: string) {
        if (!status) return;
        apiUpdateStatus.call({ id: metadata_id, status: status });
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5 className="mb-0">Data Project : {detailData?.name}</h5>
                    <p className="mb-0">{detailData?.description}</p>
                    <p className="mb-0">Diunggah Pada : {getDateTimeString(detailData?.created_at)}</p>
                </div>
            </div>
            <div className="col-12">
                <DataTable value={detailData ? [detailData] : []}>
                    <Column
                        field="status"
                        header="Status"
                        body={(row: ProjectMetadataType) => {
                            const status = row.status;
                            return (
                                <SelectButton
                                    value={status}
                                    onChange={(e) => onClickChangeStatus(e.value)}
                                    options={['DRAFT', 'PUBLISHED']}
                                />
                            );
                        }}
                    />
                </DataTable>
            </div>

            {detailData && (
                <BasemapProvider>
                    <MapLibreProvider triggerUserLocation={false}>
                        <ContentSection
                            metadata_id={metadata_id}
                            layers={detailData.layers || []}
                            onRefresh={onRefresh}
                        />
                    </MapLibreProvider>
                </BasemapProvider>
            )}
        </div>
    );
}
