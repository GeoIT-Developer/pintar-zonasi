'use client';

import BasemapProvider from '@/components/map/BasemapContext';
import { MapLibreProvider } from '@/components/map/MapLibreContext';
import API from '@/configs/api';
import useAPI from '@/hooks/useAPI';
import { useToastContext } from '@/layout/context/ToastContext';
import { ProjectMetadataType } from '@/types/response/project-metadata.interface';
import { DataType, LIST_TINGKATAN_SEKOLAH } from '@/utils/constant';
import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useState } from 'react';
import ContentSection from './ContentSection';
import { LayerSettingType } from '@/types/layer.type';

export default function ZonasiPage() {
    const toast = useToastContext();
    const [inputData, setInputData] = useState({ level: '', zonasi: '' });
    const [listDataZonasi, setListDataZonasi] = useState<(ProjectMetadataType & { no: number })[]>([]);
    const [activeData, setActiveData] = useState<ProjectMetadataType>();
    const [listLayer, setListLayer] = useState<LayerSettingType[]>([]);

    const apiGetListZonasi = useAPI<ProjectMetadataType[], string>(API.getListProjectZonasi, {
        onSuccess: (_, res) => {
            const eData = res.data;
            setListDataZonasi(
                eData.map((item, idx) => {
                    return { ...item, no: idx + 1 };
                }),
            );
        },
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
        if (inputData.level) {
            apiGetListZonasi.call(inputData.level);
        } else {
            setListDataZonasi([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputData.level]);

    useEffect(() => {
        if (!activeData) return;
        const eLayers = activeData.layers || [];
        const updateLayers: LayerSettingType[] = eLayers.map((item) => {
            const eItem: LayerSettingType = { ...item };
            if (eItem.type === DataType.JALAN) {
                eItem.show = false;
            } else {
                eItem.show = true;
            }
            if (eItem.type === DataType.SEKOLAH) {
                eItem.showLabel = true;
            }
            return eItem;
        });
        setListLayer(updateLayers);
    }, [activeData]);

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5 className="mb-0">Cek Zonasi</h5>
                </div>
            </div>
            <div className="col-12">
                <div className="card flex gap-4">
                    <div className="field mb-0 p-fluid w-full">
                        <label htmlFor="level">Tingkatan</label>
                        <Dropdown
                            id="level"
                            value={inputData.level}
                            onChange={(e) => {
                                const eVal = e.value;
                                setInputData({ level: eVal, zonasi: '' });
                                setActiveData(undefined);
                            }}
                            options={LIST_TINGKATAN_SEKOLAH}
                            optionLabel="id"
                            optionValue="id"
                            placeholder="-- Pilih Tingkatan --"
                        />
                    </div>
                    <div className="field mb-0 p-fluid w-full">
                        <label htmlFor="zonasi">Zonasi</label>
                        <Dropdown
                            id="zonasi"
                            value={inputData.zonasi}
                            onChange={(e) => {
                                const eVal = e.value;
                                setInputData((oldState) => {
                                    return { ...oldState, zonasi: eVal };
                                });
                                const eFind = listDataZonasi.find((it) => it.id === eVal);
                                setActiveData(eFind);
                            }}
                            options={listDataZonasi}
                            optionLabel="name"
                            optionValue="id"
                            placeholder="-- Pilih Zonasi --"
                        />
                    </div>
                </div>
            </div>
            {activeData && (
                <BasemapProvider>
                    <MapLibreProvider>
                        <ContentSection layers={listLayer} metadata_id={activeData.id} />
                    </MapLibreProvider>
                </BasemapProvider>
            )}
        </div>
    );
}
