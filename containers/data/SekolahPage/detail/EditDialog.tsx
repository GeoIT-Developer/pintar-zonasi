import API from '@/configs/api';
import useAPI from '@/hooks/useAPI';
import { ObjectLiteral } from '@/types/object-literal.interface';
import { SekolahType } from '@/types/response/sekolah-metadata.interface';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
    metadata_id: string;
    show: boolean;
    name: string;
    row: SekolahType | undefined;
    onCancel: () => void;
    onRefresh: () => void;
};

const initialInputData = {
    tipe: '',
    npsn: '',
    nama: '',
    alamat: '',
    kuota: 0,
    keterangan: '',
    lat: 0,
    lon: 0,
    id: 0,
};

export default function EditDialog({ onCancel, show, name, row, onRefresh, metadata_id }: Props) {
    const toast = useRef<Toast>(null);
    const [inputData, setInputData] = useState<SekolahType>(initialInputData);

    const apiEditSekolah = useAPI<ObjectLiteral, SekolahType & { metadata_id: string }>(API.putEditSekolahDatum, {
        onSuccess: () => {
            onRefresh();
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Data berhasil disimpan!',
            });
            onCancel();
        },
        onError: (err) => {
            toast.current?.show({
                severity: 'error',
                summary: 'Error!',
                detail: err,
            });
        },
    });

    useEffect(() => {
        if (row) {
            setInputData(row);
        } else {
            setInputData(initialInputData);
        }
    }, [row]);

    function onClickSave() {
        apiEditSekolah.call({
            metadata_id,
            id: inputData.id,
            tipe: inputData.tipe,
            npsn: inputData.npsn,
            nama: inputData.nama,
            alamat: inputData.alamat,
            lat: inputData.lat,
            lon: inputData.lon,
            kuota: Number(inputData.kuota),
            keterangan: inputData.keterangan,
        });
    }

    return (
        <>
            <Dialog
                header={`Edit Data ${name}`}
                visible={show}
                onHide={onCancel}
                style={{ width: '500px' }}
                modal
                footer={
                    <>
                        <Button type="button" label="Batal" icon="pi pi-times" onClick={onCancel} />
                        <Button
                            type="button"
                            label="Simpan"
                            severity="success"
                            icon="pi pi-save"
                            onClick={onClickSave}
                            text
                            loading={apiEditSekolah.loading}
                        />
                    </>
                }
            >
                <div className="flex align-items-center justify-content-center">
                    <div className="p-fluid w-full">
                        <div className="field">
                            <label htmlFor="tipe">Tipe</label>
                            <InputText
                                id="tipe"
                                type="text"
                                value={inputData.tipe}
                                onChange={(e) => {
                                    const eVal = e.target.value;
                                    if (eVal.length > 50) return;
                                    setInputData((oldState) => {
                                        return { ...oldState, tipe: eVal };
                                    });
                                }}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="npsn">NPSN</label>
                            <InputText
                                id="npsn"
                                type="text"
                                value={inputData.npsn}
                                onChange={(e) => {
                                    const eVal = e.target.value;
                                    if (eVal.length > 50) return;
                                    setInputData((oldState) => {
                                        return { ...oldState, npsn: eVal };
                                    });
                                }}
                            />
                        </div>
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
                            <label htmlFor="alamat">Alamat</label>
                            <InputTextarea
                                id="alamat"
                                rows={2}
                                value={inputData.alamat}
                                onChange={(e) => {
                                    const eVal = e.target.value;
                                    if (eVal.length > 250) return;
                                    setInputData((oldState) => {
                                        return { ...oldState, alamat: eVal };
                                    });
                                }}
                            />
                        </div>
                        <div className="flex gap-2">
                            <div className="field">
                                <label htmlFor="lat">Latitude</label>
                                <InputText
                                    id="lat"
                                    type="number"
                                    value={String(inputData.lat)}
                                    onChange={(e) => {
                                        const eVal = Number(e.target.value);
                                        setInputData((oldState) => {
                                            return { ...oldState, lat: eVal };
                                        });
                                    }}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="lon">Longitude</label>
                                <InputText
                                    id="lon"
                                    type="number"
                                    value={String(inputData.lon)}
                                    onChange={(e) => {
                                        const eVal = Number(e.target.value);
                                        setInputData((oldState) => {
                                            return { ...oldState, lon: eVal };
                                        });
                                    }}
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label htmlFor="kuota">Kuota</label>
                            <InputText
                                id="kuota"
                                type="number"
                                value={String(inputData.kuota)}
                                onChange={(e) => {
                                    const eVal = Number(e.target.value);
                                    setInputData((oldState) => {
                                        return { ...oldState, kuota: eVal };
                                    });
                                }}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="keterangan">Keterangan</label>
                            <InputTextarea
                                id="keterangan"
                                rows={3}
                                value={inputData.keterangan}
                                onChange={(e) => {
                                    const eVal = e.target.value;
                                    if (eVal.length > 250) return;
                                    setInputData((oldState) => {
                                        return { ...oldState, keterangan: eVal };
                                    });
                                }}
                            />
                        </div>
                    </div>
                </div>
            </Dialog>

            <Toast ref={toast} />
        </>
    );
}
