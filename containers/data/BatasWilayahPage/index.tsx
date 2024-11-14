'use client';

import API from '@/configs/api';
import { ROUTE } from '@/configs/route';
import useAPI from '@/hooks/useAPI';
import { ObjectLiteral } from '@/types/object-literal.interface';
import { BatasWilayahMetadataType } from '@/types/response/batas-wilayah-metadata.interface';
import { getDateTimeString } from '@/utils/helper';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { SplitButton } from 'primereact/splitbutton';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';

const THIS_ROUTE = ROUTE.DATA.BATAS_WILAYAH;

export default function BatasWilayahPage() {
    const router = useRouter();
    const [listData, setListData] = useState<(BatasWilayahMetadataType & { no: number })[]>([]);
    const [dialogDelete, setDialogDelete] = useState({ show: false, id: '', name: '' });
    const toast = useRef<Toast>(null);

    const apiGetListBatasWilayah = useAPI<BatasWilayahMetadataType[]>(API.getListBatasWilayah, {
        callOnFirstRender: true,
        onSuccess: (_, res) => {
            const eData = res.data;
            setListData(
                eData.map((item, idx) => {
                    return { ...item, no: idx + 1 };
                })
            );
        },
        onError: (err) => {
            toast.current?.show({
                severity: 'error',
                summary: 'Error!',
                detail: err,
                life: 3000
            });
        }
    });

    const apiDeleteBatasWilayah = useAPI<ObjectLiteral, string>(API.deleteBatasWilayah, {
        onSuccess: () => {
            apiGetListBatasWilayah.call();
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Data berhasil dihapus!'
            });
            cancelDialogDelete();
        },
        onError: (err) => {
            toast.current?.show({
                severity: 'error',
                summary: 'Error!',
                detail: err
            });
        }
    });

    function cancelDialogDelete() {
        setDialogDelete({ show: false, id: '', name: '' });
    }

    function onClickDelete(id: string) {
        apiDeleteBatasWilayah.call(id);
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5 className="mb-0">Data Batas Wilayah</h5>
                </div>
            </div>

            <div className="col-12">
                <div className="card">
                    <DataTable
                        value={listData}
                        scrollable
                        scrollHeight="400px"
                        loading={apiGetListBatasWilayah.loading}
                        className="mt-3"
                        header={
                            <div className="flex justify-content-between">
                                <Button type="button" icon="pi pi-plus" label="Tambah Data" outlined onClick={() => router.push(THIS_ROUTE.UNGGAH.URL)}></Button>
                            </div>
                        }
                    >
                        <Column field="no" header="No" sortable style={{ flexGrow: 1, flexBasis: '160px' }} />
                        <Column field="name" header="Nama" sortable style={{ flexGrow: 1, flexBasis: '160px' }} className="font-bold" />
                        <Column field="description" header="Deskripsi" sortable style={{ flexGrow: 1, flexBasis: '200px' }} />
                        <Column
                            field="created_at"
                            header="Tanggal"
                            sortable
                            style={{ flexGrow: 1, flexBasis: '160px' }}
                            body={(row: BatasWilayahMetadataType) => {
                                return getDateTimeString(row.created_at);
                            }}
                        />
                        <Column
                            field="id"
                            header="Aksi"
                            style={{ flexGrow: 1, flexBasis: '160px' }}
                            body={(row: BatasWilayahMetadataType) => {
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
                                                }
                                            }
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
                header="Hapus Data Batas Wilayah"
                visible={dialogDelete.show}
                onHide={cancelDialogDelete}
                style={{ width: '350px' }}
                modal
                footer={
                    <>
                        <Button type="button" label="Batal" icon="pi pi-times" onClick={cancelDialogDelete} />
                        <Button type="button" label="Hapus" severity="danger" icon="pi pi-trash" onClick={() => onClickDelete(dialogDelete.id)} text loading={apiDeleteBatasWilayah.loading} />
                    </>
                }
            >
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>
                        Anda yakin ingin menghapus data batas wilayah <b>{dialogDelete.name}</b>?
                    </span>
                </div>
            </Dialog>

            <Toast ref={toast} />
        </div>
    );
}
