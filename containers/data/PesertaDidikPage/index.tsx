'use client';

import API from '@/configs/api';
import { ROUTE } from '@/configs/route';
import useAPI from '@/hooks/useAPI';
import { ObjectLiteral } from '@/types/object-literal.interface';
import { PesertaDidikMetadataType } from '@/types/response/peserta-didik-metadata.interface';
import { getDateTimeString } from '@/utils/helper';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { SplitButton } from 'primereact/splitbutton';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';

const THIS_ROUTE = ROUTE.DATA.PESERTA_DIDIK;

export default function PesertaDidikPage() {
    const router = useRouter();
    const [listData, setListData] = useState<(PesertaDidikMetadataType & { no: number })[]>([]);
    const [dialogDelete, setDialogDelete] = useState({ show: false, id: '', name: '' });
    const toast = useRef<Toast>(null);

    const apiGetListPesertaDidik = useAPI<PesertaDidikMetadataType[]>(API.getListPesertaDidik, {
        callOnFirstRender: true,
        onSuccess: (_, res) => {
            const eData = res.data;
            setListData(
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

    const apiDeletePesertaDidik = useAPI<ObjectLiteral, string>(API.deletePesertaDidik, {
        onSuccess: () => {
            apiGetListPesertaDidik.call();
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Data berhasil dihapus!',
            });
            cancelDialogDelete();
        },
        onError: (err) => {
            toast.current?.show({
                severity: 'error',
                summary: 'Error!',
                detail: err,
            });
        },
    });

    function cancelDialogDelete() {
        setDialogDelete({ show: false, id: '', name: '' });
    }

    function onClickDelete(id: string) {
        apiDeletePesertaDidik.call(id);
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5 className="mb-0">Data Peserta Didik</h5>
                </div>
            </div>

            <div className="col-12">
                <div className="card">
                    <DataTable
                        value={listData}
                        scrollable
                        scrollHeight="400px"
                        loading={apiGetListPesertaDidik.loading}
                        className="mt-3"
                        header={
                            <div className="flex justify-content-between">
                                <Button
                                    type="button"
                                    icon="pi pi-plus"
                                    label="Tambah Data"
                                    outlined
                                    onClick={() => router.push(THIS_ROUTE.UNGGAH.URL)}
                                />
                            </div>
                        }
                        paginator
                        rows={10}
                    >
                        <Column field="no" header="No" sortable style={{ flexGrow: 1, flexBasis: '160px' }} />
                        <Column
                            field="name"
                            header="Nama"
                            sortable
                            style={{ flexGrow: 1, flexBasis: '160px' }}
                            className="font-bold"
                        />
                        <Column
                            field="description"
                            header="Deskripsi"
                            sortable
                            style={{ flexGrow: 1, flexBasis: '200px' }}
                        />
                        <Column
                            field="created_at"
                            header="Tanggal"
                            sortable
                            style={{ flexGrow: 1, flexBasis: '160px' }}
                            body={(row: PesertaDidikMetadataType) => {
                                return getDateTimeString(row.created_at);
                            }}
                        />
                        <Column
                            field="id"
                            header="Aksi"
                            style={{ flexGrow: 1, flexBasis: '160px' }}
                            body={(row: PesertaDidikMetadataType) => {
                                return (
                                    <SplitButton
                                        outlined
                                        size="small"
                                        label="Detail"
                                        model={[
                                            {
                                                label: 'Hapus',
                                                icon: 'pi pi-times',
                                                command: () => {
                                                    setDialogDelete({ show: true, id: row.id, name: row.name });
                                                },
                                            },
                                        ]}
                                        onClick={() => {
                                            window.open(THIS_ROUTE.DETAIL.setURL(row.id), '_blank');
                                        }}
                                    />
                                );
                            }}
                        />
                    </DataTable>
                </div>
            </div>

            <Dialog
                header="Hapus Data Peserta Didik"
                visible={dialogDelete.show}
                onHide={cancelDialogDelete}
                style={{ width: '350px' }}
                modal
                footer={
                    <>
                        <Button type="button" label="Batal" icon="pi pi-times" onClick={cancelDialogDelete} />
                        <Button
                            type="button"
                            label="Hapus"
                            severity="danger"
                            icon="pi pi-trash"
                            onClick={() => onClickDelete(dialogDelete.id)}
                            text
                            loading={apiDeletePesertaDidik.loading}
                        />
                    </>
                }
            >
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>
                        Anda yakin ingin menghapus data peserta didik <b>{dialogDelete.name}</b>?
                    </span>
                </div>
            </Dialog>

            <Toast ref={toast} />
        </div>
    );
}
