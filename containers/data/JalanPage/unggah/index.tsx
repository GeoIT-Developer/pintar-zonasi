'use client';

import BasemapProvider from '@/components/map/BasemapContext';
import { MapLibreProvider } from '@/components/map/MapLibreContext';
import API from '@/configs/api';
import { ROUTE } from '@/configs/route';
import useAPI from '@/hooks/useAPI';
import { ObjectLiteral } from '@/types/object-literal.interface';
import { errorResponse } from '@/utils';
import { getGeojsonData } from '@/utils/helper';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import MapCard from './MapCard';

const THIS_ROUTE = ROUTE.DATA.JALAN;

export default function UnggahJalanPage() {
    const router = useRouter();
    const [dialogUnggah, setDialogUnggah] = useState(false);
    const toast = useRef<Toast>(null);
    const [inputData, setInputData] = useState({ nama: '', deskripsi: '' });
    const refUpload = useRef<FileUpload>(null);
    const [inputFile, setInputFile] = useState<File>();
    const [geojsonData, setGeojsonData] = useState<ObjectLiteral>();

    const apiUnggahJalan = useAPI<ObjectLiteral, { eFile: File; name: string; description: string }>(
        API.postUploadJalan,
        {
            onSuccess: () => {
                cancelDialogUnggah();
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Data berhasil diunggah!',
                });
                setTimeout(() => {
                    router.push(THIS_ROUTE.URL);
                }, 1500);
            },
            onError: (err) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error!',
                    detail: err,
                });
            },
        },
    );

    function cancelDialogUnggah() {
        setDialogUnggah(false);
    }

    function onClickUnggah() {
        if (!inputData.nama || !inputFile) return;
        apiUnggahJalan.call({ name: inputData.nama, description: inputData.deskripsi, eFile: inputFile });
    }

    useEffect(() => {
        if (inputFile) {
            getGeojsonData(inputFile)
                .then((res) => {
                    const eFeat = res?.features[0];
                    const eProp = eFeat?.properties;
                    setGeojsonData(res);
                })
                .catch((err) => {
                    setInputFile(undefined);
                    if (refUpload.current) {
                        refUpload.current.clear();
                    }
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error!',
                        detail: errorResponse(err),
                    });
                });
        }
    }, [inputFile]);

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5 className="mb-0">Unggah Data Jalan</h5>
                </div>
            </div>
            <div className="col-12">
                <div className="card p-fluid">
                    <div className="field">
                        <label htmlFor="name">Nama</label>
                        <InputText
                            id="name"
                            type="text"
                            value={inputData.nama}
                            onChange={(e) => {
                                const eVal = e.target.value;
                                if (eVal.length > 50) return;
                                setInputData((oldState) => {
                                    return { ...oldState, nama: eVal };
                                });
                            }}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="deskripsi">Deskripsi</label>
                        <InputTextarea
                            id="deskripsi"
                            rows={3}
                            value={inputData.deskripsi}
                            onChange={(e) => {
                                const eVal = e.target.value;
                                if (eVal.length > 250) return;
                                setInputData((oldState) => {
                                    return { ...oldState, deskripsi: eVal };
                                });
                            }}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="file">Data Spasial</label>
                        <FileUpload
                            ref={refUpload}
                            mode="basic"
                            name="file"
                            accept=".zip, .kml, .geojson"
                            onSelect={(e) => {
                                const eFiles = e.files;
                                if (eFiles.length > 0) {
                                    setInputFile(eFiles[0]);
                                }
                            }}
                            uploadHandler={() => {
                                if (refUpload.current) {
                                    refUpload.current.clear();
                                    setInputFile(undefined);
                                    setGeojsonData(undefined);
                                }
                            }}
                            customUpload
                        />
                        <small>Data spasial dalam format .geojson, .kml, atau shapefile dalam .zip</small>
                    </div>
                    <div className="w-full text-right">
                        <Button
                            icon="pi pi-upload"
                            label="Unggah Data"
                            className="w-fit"
                            disabled={!inputFile || !inputData.nama}
                            onClick={() => setDialogUnggah(true)}
                        />
                    </div>
                </div>
            </div>

            {geojsonData && inputFile && (
                <BasemapProvider>
                    <MapLibreProvider triggerUserLocation={false}>
                        <MapCard geojsonData={geojsonData} inputFile={inputFile} />
                    </MapLibreProvider>
                </BasemapProvider>
            )}

            <Dialog
                header="Unggah Data Jalan"
                visible={dialogUnggah}
                onHide={cancelDialogUnggah}
                style={{ width: '350px' }}
                modal
                footer={
                    <>
                        <Button type="button" label="Batal" icon="pi pi-times" onClick={cancelDialogUnggah} />
                        <Button
                            type="button"
                            label="Unggah"
                            severity="success"
                            icon="pi pi-upload"
                            onClick={onClickUnggah}
                            text
                            loading={apiUnggahJalan.loading}
                        />
                    </>
                }
            >
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>
                        Anda yakin ingin mengunggah data jalan <b>{inputData.nama}</b>?
                    </span>
                </div>
            </Dialog>

            <Toast ref={toast} />
        </div>
    );
}
