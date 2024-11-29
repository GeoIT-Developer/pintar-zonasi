'use client';

import BasemapProvider from '@/components/map/BasemapContext';
import { MapLibreProvider } from '@/components/map/MapLibreContext';
import { ObjectLiteral } from '@/types/object-literal.interface';
import React, { useState } from 'react';
import MapCard from './MapCard';
import PreviewCSVCard from '@/components/preview/PreviewCSVCard';
import FormSection from './FormSection';

const COLUMN = [
    { field: 'no', label: 'No' },
    { field: 'tipe', label: 'Tipe' },
    { field: 'npsn', label: 'NPSN' },
    { field: 'nama', label: 'Nama' },
    { field: 'alamat', label: 'Alamat' },
    { field: 'lat', label: 'Lat' },
    { field: 'lon', label: 'Lon' },
    { field: 'kuota', label: 'Kuota' },
    { field: 'keterangan', label: 'Keterangan' },
];

export default function UnggahSekolahPage() {
    const [inputFile, setInputFile] = useState<File>();
    const [jsonData, setJsonData] = useState<ObjectLiteral[]>([]);

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5 className="mb-0">Unggah Data Sekolah</h5>
                </div>
            </div>
            <FormSection inputFile={inputFile} setInputFile={setInputFile} setJsonData={setJsonData} />

            {jsonData && inputFile && (
                <BasemapProvider>
                    <MapLibreProvider triggerUserLocation={false}>
                        <MapCard jsonData={jsonData} inputFile={inputFile} />
                        <PreviewCSVCard dataset={jsonData} column={COLUMN} />
                    </MapLibreProvider>
                </BasemapProvider>
            )}
        </div>
    );
}
