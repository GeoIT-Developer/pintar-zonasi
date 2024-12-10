'use client';

import API from '@/configs/api';
import { ROUTE } from '@/configs/route';
import useAPI from '@/hooks/useAPI';
import { useToastContext } from '@/layout/context/ToastContext';
import { ObjectLiteral } from '@/types/object-literal.interface';
import { getStatusSeverity, ProjectMetadataType } from '@/types/response/project-metadata.interface';
import { LIST_TIPE_PROJECT } from '@/utils/constant';
import { getDateTimeString } from '@/utils/helper';
import { useRouter } from 'next/navigation';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { SplitButton } from 'primereact/splitbutton';
import React, { useState } from 'react';

const THIS_ROUTE = ROUTE.ZONASI;

export default function ProjectZonasiPage() {
    const router = useRouter();
    const [listDataPublic, setListDataPublic] = useState<(ProjectMetadataType & { no: number })[]>([]);
    const [listDataPrivate, setListDataPrivate] = useState<(ProjectMetadataType & { no: number })[]>([]);
    const [dialogDelete, setDialogDelete] = useState({ show: false, id: '', name: '' });
    const toast = useToastContext();

    const apiGetListPublic = useAPI<ProjectMetadataType[], string>(API.getListProject, {
        callOnFirstRender: true,
        callOnFirstRenderParams: LIST_TIPE_PROJECT[0].id,
        onSuccess: (_, res) => {
            const eData = res.data;
            setListDataPublic(
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
    const apiGetListPrivate = useAPI<ProjectMetadataType[], string>(API.getListProject, {
        callOnFirstRender: true,
        callOnFirstRenderParams: LIST_TIPE_PROJECT[1].id,
        onSuccess: (_, res) => {
            const eData = res.data;
            setListDataPrivate(
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

    const apiDeleteProject = useAPI<ObjectLiteral, string>(API.deleteProject, {
        onSuccess: () => {
            apiGetListPrivate.call();
            apiGetListPublic.call();
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
        apiDeleteProject.call(id);
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5 className="mb-0">Project Zonasi</h5>
                </div>
            </div>

            <div className="col-12">
                <div className="card">
                    <div className="flex justify-content-between">
                        <Button
                            type="button"
                            icon="pi pi-plus"
                            label="Buat Project Baru"
                            outlined
                            onClick={() => router.push(THIS_ROUTE.NEW.URL)}
                        />
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <DataTable
                        value={listDataPublic}
                        scrollable
                        scrollHeight="400px"
                        loading={apiGetListPublic.loading}
                        className="mt-3"
                        header={<p>Project Publik</p>}
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
                        <Column field="level" header="Tingkatan" sortable style={{ flexGrow: 1, flexBasis: '160px' }} />
                        <Column
                            field="description"
                            header="Deskripsi"
                            sortable
                            style={{ flexGrow: 1, flexBasis: '200px' }}
                        />
                        <Column
                            field="status"
                            header="Status"
                            sortable
                            style={{ flexGrow: 1, flexBasis: '160px' }}
                            body={(row: ProjectMetadataType) => {
                                const status = row.status;
                                return <Badge value={status} severity={getStatusSeverity(status)} />;
                            }}
                        />
                        <Column
                            field="created_at"
                            header="Tanggal"
                            sortable
                            style={{ flexGrow: 1, flexBasis: '160px' }}
                            body={(row: ProjectMetadataType) => {
                                return getDateTimeString(row.created_at);
                            }}
                        />
                        <Column
                            field="id"
                            header="Aksi"
                            style={{ flexGrow: 1, flexBasis: '160px' }}
                            body={(row: ProjectMetadataType) => {
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
            <div className="col-12">
                <div className="card">
                    <DataTable
                        value={listDataPrivate}
                        scrollable
                        scrollHeight="400px"
                        loading={apiGetListPrivate.loading}
                        className="mt-3"
                        header={<p>Project Terbatas</p>}
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
                        <Column field="level" header="Tingkatan" sortable style={{ flexGrow: 1, flexBasis: '160px' }} />
                        <Column
                            field="description"
                            header="Deskripsi"
                            sortable
                            style={{ flexGrow: 1, flexBasis: '200px' }}
                        />
                        <Column
                            field="status"
                            header="Status"
                            sortable
                            style={{ flexGrow: 1, flexBasis: '160px' }}
                            body={(row: ProjectMetadataType) => {
                                const status = row.status;
                                return <Badge value={status} severity={getStatusSeverity(status)} />;
                            }}
                        />
                        <Column
                            field="created_at"
                            header="Tanggal"
                            sortable
                            style={{ flexGrow: 1, flexBasis: '160px' }}
                            body={(row: ProjectMetadataType) => {
                                return getDateTimeString(row.created_at);
                            }}
                        />
                        <Column
                            field="id"
                            header="Aksi"
                            style={{ flexGrow: 1, flexBasis: '160px' }}
                            body={(row: ProjectMetadataType) => {
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
                header="Hapus Data Project"
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
                            loading={apiDeleteProject.loading}
                        />
                    </>
                }
            >
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>
                        Anda yakin ingin menghapus data project <b>{dialogDelete.name}</b>?
                    </span>
                </div>
            </Dialog>
        </div>
    );
}
