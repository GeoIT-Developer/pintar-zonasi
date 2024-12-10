import API from '@/configs/api';
import useAPI from '@/hooks/useAPI';
import { useToastContext } from '@/layout/context/ToastContext';
import { LayerType } from '@/types/layer.type';
import { ObjectLiteral } from '@/types/object-literal.interface';
import { BatasWilayahMetadataType } from '@/types/response/batas-wilayah-metadata.interface';
import { JalanMetadataType } from '@/types/response/jalan-metadata.interface';
import { PesertaDidikMetadataType } from '@/types/response/peserta-didik-metadata.interface';
import { SekolahMetadataType } from '@/types/response/sekolah-metadata.interface';
import { DataType, LIST_LAYER_DATA } from '@/utils/constant';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useState } from 'react';

type Props = {
    show: boolean;
    onCancel: () => void;
    onAdd: (layer: LayerType) => void;
};

const initialInputData = {
    jenis: '',
    data: '',
};

type InputType = {
    jenis: string;
    data: string;
};

export default function TambahDialog({ onCancel, show, onAdd }: Props) {
    const toast = useToastContext();
    const [inputData, setInputData] = useState<InputType>(initialInputData);
    const [listDataOption, setListDataOption] = useState<ObjectLiteral[]>([]);

    function onSuccess(eData: ObjectLiteral[]) {
        setListDataOption(
            eData.map((item, idx) => {
                return { ...item, no: idx + 1 };
            }),
        );
    }

    function onError(err: any) {
        setListDataOption([]);
        toast.current?.show({
            severity: 'error',
            summary: 'Error!',
            detail: err,
            life: 3000,
        });
    }

    const apiGetListSekolah = useAPI<SekolahMetadataType[]>(API.getListSekolah, {
        onSuccess: (_, res) => {
            onSuccess(res.data || []);
        },
        onError: (err) => {
            onError(err);
        },
    });

    const apiGetListPesertaDidik = useAPI<PesertaDidikMetadataType[]>(API.getListPesertaDidik, {
        onSuccess: (_, res) => {
            onSuccess(res.data || []);
        },
        onError: (err) => {
            onError(err);
        },
    });

    const apiGetListJalan = useAPI<JalanMetadataType[]>(API.getListJalan, {
        onSuccess: (_, res) => {
            onSuccess(res.data || []);
        },
        onError: (err) => {
            onError(err);
        },
    });

    const apiGetListBatasWilayah = useAPI<BatasWilayahMetadataType[]>(API.getListBatasWilayah, {
        onSuccess: (_, res) => {
            onSuccess(res.data || []);
        },
        onError: (err) => {
            onError(err);
        },
    });

    useEffect(() => {
        const eJenis = inputData.jenis;
        if (eJenis === DataType.BATAS_WILAYAH) {
            apiGetListBatasWilayah.call();
        } else if (eJenis === DataType.JALAN) {
            apiGetListJalan.call();
        } else if (eJenis === DataType.SEKOLAH) {
            apiGetListSekolah.call();
        } else if (eJenis === DataType.PESERTA_DIDIK) {
            apiGetListPesertaDidik.call();
        } else {
            setListDataOption([]);
        }
    }, [inputData.jenis]);

    function onClickAdd() {
        const eOption = listDataOption.find((item) => item.id === inputData.data);
        if (eOption) {
            const eColor =
                inputData.jenis === DataType.BATAS_WILAYAH
                    ? '#ff6400'
                    : inputData.jenis === DataType.JALAN
                    ? '#333'
                    : '#ff0000';
            onAdd({ id: eOption.id, color: eColor, name: eOption.name, type: inputData.jenis as DataType });
            onCancel();
        }
    }

    return (
        <>
            <Dialog
                header="Tambah Layer Data"
                visible={show}
                onHide={onCancel}
                style={{ width: '500px' }}
                modal
                footer={
                    <>
                        <Button type="button" label="Batal" icon="pi pi-times" onClick={onCancel} />
                        <Button
                            type="button"
                            label="Tambah"
                            severity="success"
                            icon="pi pi-plus-circle"
                            onClick={onClickAdd}
                            text
                            disabled={!inputData.data || !inputData.jenis}
                        />
                    </>
                }
            >
                <div className="flex align-items-center justify-content-center">
                    <div className="p-fluid w-full">
                        <div className="field">
                            <label htmlFor="jenis">Jenis Data</label>
                            <Dropdown
                                id="jenis"
                                value={inputData.jenis}
                                onChange={(e) => {
                                    const eVal = e.value;
                                    setInputData((oldState) => {
                                        return { ...oldState, jenis: eVal };
                                    });
                                }}
                                options={LIST_LAYER_DATA}
                                optionLabel="label"
                                optionValue="id"
                                placeholder="-- Pilih Jenis Data --"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="data">Data</label>
                            <Dropdown
                                id="data"
                                value={inputData.data}
                                onChange={(e) => {
                                    const eVal = e.value;
                                    setInputData((oldState) => {
                                        return { ...oldState, data: eVal };
                                    });
                                }}
                                options={listDataOption}
                                optionLabel="name"
                                optionValue="id"
                                placeholder="-- Pilih Data --"
                            />
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
}
