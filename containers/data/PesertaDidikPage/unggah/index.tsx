'use client';

import BasemapProvider from '@/components/map/BasemapContext';
import { MapLibreProvider } from '@/components/map/MapLibreContext';
import { ObjectLiteral } from '@/types/object-literal.interface';
import React, { useState } from 'react';
import MapCard from './MapCard';
import PreviewCSVCard from '@/components/preview/PreviewCSVCard';
import FormSection from './FormSection';
import { Button } from 'primereact/button';
import { formatNumberWithSeparator } from '@/utils';

const COLUMN = [
    { field: 'no', label: 'No' },
    { field: 'nisn', label: 'NISN' },
    { field: 'nama', label: 'Nama' },
    { field: 'jenis_kelamin', label: 'Jenis Kelamin' },
    { field: 'tanggal_lahir', label: 'Tanggal Lahir' },
    { field: 'alamat', label: 'Alamat' },
    { field: 'lat', label: 'Lat' },
    { field: 'lon', label: 'Lon' },
    { field: 'prioritas', label: 'Prioritas' },
    { field: 'keterangan', label: 'Keterangan' },
];

export default function UnggahPesertaDidikPage() {
    const [inputFile, setInputFile] = useState<File>();
    const [jsonData, setJsonData] = useState<ObjectLiteral[]>([]);

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5 className="mb-0">Unggah Data Peserta Didik</h5>
                </div>
            </div>
            <FormSection inputFile={inputFile} setInputFile={setInputFile} setJsonData={setJsonData} />

            {jsonData && inputFile && (
                <BasemapProvider>
                    <MapLibreProvider triggerUserLocation={false}>
                        <MapCard jsonData={jsonData} inputFile={inputFile} />
                        <PreviewCSVCard
                            dataset={jsonData}
                            column={COLUMN}
                            leftAction={
                                <Button
                                    type="button"
                                    severity="secondary"
                                    label={`${formatNumberWithSeparator(jsonData.length)} Sekolah`}
                                    outlined
                                />
                            }
                        />
                    </MapLibreProvider>
                </BasemapProvider>
            )}
        </div>
    );
}
