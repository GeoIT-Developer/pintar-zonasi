'use client';

import API from '@/configs/api';
import { ROUTE } from '@/configs/route';
import useAPI from '@/hooks/useAPI';
import { ObjectLiteral } from '@/types/object-literal.interface';
import { errorResponse } from '@/utils';
import { LIST_TINGKATAN_SEKOLAH } from '@/utils/constant';
import { csvFileToJson } from '@/utils/helper';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';

const THIS_ROUTE = ROUTE.DATA.PESERTA_DIDIK;

type Props = {
    inputFile: File | undefined;
    setInputFile: (file: File | undefined) => void;
    setJsonData: (json: ObjectLiteral[]) => void;
};

export default function FormSection({ inputFile, setInputFile, setJsonData }: Props) {
    const router = useRouter();
    const [dialogUnggah, setDialogUnggah] = useState(false);
    const toast = useRef<Toast>(null);
    const [inputData, setInputData] = useState({ nama: '', deskripsi: '', level: '' });
    const refUpload = useRef<FileUpload>(null);

    const apiUnggahPesertaDidik = useAPI<
        ObjectLiteral,
        {
            eFile: File;
            name: string;
            level: string;
            description: string;
        }
    >(API.postUploadPesertaDidik, {
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
    });

    function cancelDialogUnggah() {
        setDialogUnggah(false);
    }

    function onClickUnggah() {
        if (!inputData.nama || !inputData.level || !inputFile) return;
        apiUnggahPesertaDidik.call({
            name: inputData.nama,
            level: inputData.level,
            description: inputData.deskripsi,
            eFile: inputFile,
        });
    }

    useEffect(() => {
        if (inputFile) {
            csvFileToJson(inputFile)
                .then((res) => {
                    setJsonData(res);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputFile]);

    return (
        <>
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
                        <label htmlFor="level">Tingkatan</label>
                        <Dropdown
                            id="level"
                            value={inputData.level}
                            onChange={(e) => {
                                const eVal = e.value;
                                setInputData((oldState) => {
                                    return { ...oldState, level: eVal };
                                });
                            }}
                            options={LIST_TINGKATAN_SEKOLAH}
                            optionLabel="id"
                            optionValue="id"
                            placeholder="-- Pilih Tingkatan --"
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
                        <label htmlFor="file">Data Peserta Didik</label>
                        <FileUpload
                            ref={refUpload}
                            mode="basic"
                            name="file"
                            accept=".csv"
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
                                    setJsonData([]);
                                }
                            }}
                            customUpload
                        />
                        <small>
                            Data peserta didik harus dalam format .csv dan memiliki kolom{' '}
                            <strong>
                                nisn, nama, jenis_kelamin, alamat, lat(latitude), lon(longitude), tanggal_lahir,
                                prioritas, dan keterangan
                            </strong>
                        </small>
                    </div>
                    <div className="w-full text-right">
                        <Button
                            icon="pi pi-upload"
                            label="Unggah Data"
                            className="w-fit"
                            disabled={!inputFile || !inputData.nama || !inputData.level}
                            onClick={() => setDialogUnggah(true)}
                        />
                    </div>
                </div>
            </div>

            <Dialog
                header="Unggah Data Peserta Didik"
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
                            loading={apiUnggahPesertaDidik.loading}
                        />
                    </>
                }
            >
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>
                        Anda yakin ingin mengunggah data peserta didik <b>{inputData.nama}</b>?
                    </span>
                </div>
            </Dialog>

            <Toast ref={toast} />
        </>
    );
}
