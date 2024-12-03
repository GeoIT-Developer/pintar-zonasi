import API from '@/configs/api';
import useAPI from '@/hooks/useAPI';
import { ObjectLiteral } from '@/types/object-literal.interface';
import { PesertaDidikType } from '@/types/response/peserta-didik-metadata.interface';
import { LIST_JENIS_KELAMIN } from '@/utils/constant';
import { formatDate } from '@/utils/helper';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';

type Props = {
    metadata_id: string;
    show: boolean;
    onCancel: () => void;
    onRefresh: () => void;
};

const initialInputData = {
    nisn: '',
    nama: '',
    jenis_kelamin: '',
    tanggal_lahir: '',
    alamat: '',
    prioritas: 0,
    keterangan: '',
    lat: 0,
    lon: 0,
    id: 0,
};

export default function TambahDialog({ onCancel, show, onRefresh, metadata_id }: Props) {
    const toast = useRef<Toast>(null);
    const [inputData, setInputData] = useState<PesertaDidikType>(initialInputData);

    const apiTambahPesertaDidik = useAPI<ObjectLiteral, Omit<PesertaDidikType, 'id'> & { metadata_id: string }>(
        API.postTambahPesertaDidikDatum,
        {
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
        },
    );

    function onClickSave() {
        apiTambahPesertaDidik.call({
            metadata_id,
            nisn: inputData.nisn,
            nama: inputData.nama,
            jenis_kelamin: inputData.jenis_kelamin,
            tanggal_lahir: formatDate(inputData.tanggal_lahir, { to: 'DD/MM/YYYY' }),
            alamat: inputData.alamat,
            lat: inputData.lat,
            lon: inputData.lon,
            prioritas: Number(inputData.prioritas),
            keterangan: inputData.keterangan,
        });
    }

    return (
        <>
            <Dialog
                header="Tambah Data PesertaDidik"
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
                            loading={apiTambahPesertaDidik.loading}
                        />
                    </>
                }
            >
                <div className="flex align-items-center justify-content-center">
                    <div className="p-fluid w-full">
                        <div className="field">
                            <label htmlFor="nisn">NISN</label>
                            <InputText
                                id="nisn"
                                type="text"
                                value={inputData.nisn}
                                onChange={(e) => {
                                    const eVal = e.target.value;
                                    if (eVal.length > 50) return;
                                    setInputData((oldState) => {
                                        return { ...oldState, nisn: eVal };
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
                            <label htmlFor="jenis_kelamin">Jenis Kelamin</label>
                            <Dropdown
                                id="jenis_kelamin"
                                value={inputData.jenis_kelamin}
                                onChange={(e) => {
                                    const eVal = e.value;
                                    setInputData((oldState) => {
                                        return { ...oldState, jenis_kelamin: eVal };
                                    });
                                }}
                                options={LIST_JENIS_KELAMIN}
                                optionLabel="id"
                                optionValue="id"
                                placeholder="-- Pilih Jenis Kelamin --"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="tanggal_lahir">Tanggal Lahir</label>
                            <Calendar
                                showIcon
                                showButtonBar
                                value={inputData.tanggal_lahir ? new Date(inputData.tanggal_lahir) : null}
                                onChange={(e) => {
                                    const eVal = e.value || '';
                                    const eDate = formatDate(eVal, { to: 'YYYY-MM-DD' });
                                    setInputData((oldState) => {
                                        return { ...oldState, tanggal_lahir: eDate };
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
                            <label htmlFor="prioritas">Prioritas</label>
                            <InputText
                                id="prioritas"
                                type="number"
                                value={String(inputData.prioritas)}
                                onChange={(e) => {
                                    const eVal = Number(e.target.value);
                                    setInputData((oldState) => {
                                        return { ...oldState, prioritas: eVal };
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
