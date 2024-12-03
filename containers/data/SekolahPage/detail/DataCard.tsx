import API from '@/configs/api';
import useAPI from '@/hooks/useAPI';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import PreviewCSVCard from '@/components/preview/PreviewCSVCard';
import { SplitButton } from 'primereact/splitbutton';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { ObjectLiteral } from '@/types/object-literal.interface';
import { useMapLibreContext } from '@/components/map/MapLibreContext';
import EditDialog from './EditDialog';
import { SekolahType } from '@/types/response/sekolah-metadata.interface';
import TambahDialog from './TambahDialog';
import { formatNumberWithSeparator, sumByKey } from '@/utils';

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

type Props = { metadata_id: string; onRefresh: () => void; listData: SekolahType[] };
const InitialDialogEdit = { show: false, id: '', name: '', row: undefined };

export default function DataCard({ metadata_id, onRefresh, listData }: Props) {
    const toast = useRef<Toast>(null);
    const [dialogEdit, setDialogEdit] = useState<{
        show: boolean;
        id: string;
        name: string;
        row: SekolahType | undefined;
    }>(InitialDialogEdit);
    const [dialogDelete, setDialogDelete] = useState({ show: false, id: '', name: '' });
    const [showDialogTambah, setShowDialogTambah] = useState(false);
    const { myMap } = useMapLibreContext();

    const apiDeleteSekolah = useAPI<ObjectLiteral, { id: string; metadata_id: string }>(API.deleteSekolahDatum, {
        onSuccess: () => {
            onRefresh();
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
        apiDeleteSekolah.call({ id, metadata_id });
    }

    function cancelDialogEdit() {
        setDialogEdit(InitialDialogEdit);
    }

    function onClickCopy(text: string) {
        toast.current?.show({
            severity: 'success',
            summary: 'Copied!',
        });
        navigator.clipboard.writeText(text);
    }

    return (
        <>
            <PreviewCSVCard
                dataset={listData}
                column={COLUMN}
                actionColumn={(row) => {
                    return (
                        <SplitButton
                            outlined
                            size="small"
                            label="Edit"
                            model={[
                                {
                                    label: 'Lokasi',
                                    icon: 'pi pi-send',
                                    command: () => {
                                        myMap?.flyTo({
                                            center: [row.lon, row.lat],
                                            essential: true,
                                            speed: 0.85,
                                            zoom: 16,
                                        });
                                    },
                                },
                                {
                                    label: 'Hapus',
                                    icon: 'pi pi-times',
                                    command: () => {
                                        setDialogDelete({ show: true, id: row.id, name: row.nama });
                                    },
                                },
                            ]}
                            onClick={() => {
                                setDialogEdit({ show: true, id: row.id, name: row.nama, row: row as SekolahType });
                            }}
                        />
                    );
                }}
                action={
                    <Button
                        type="button"
                        label="Tambah Sekolah"
                        icon="pi pi-plus"
                        onClick={() => setShowDialogTambah(true)}
                    />
                }
                leftAction={
                    <>
                        <Button
                            type="button"
                            severity="secondary"
                            label={`${formatNumberWithSeparator(listData.length)} Sekolah`}
                            outlined
                            onClick={() => {
                                onClickCopy(String(listData.length));
                            }}
                        />
                        <Button
                            severity="secondary"
                            label={`Total Kuota = ${formatNumberWithSeparator(sumByKey(listData, 'kuota'))}`}
                            outlined
                            onClick={() => {
                                onClickCopy(String(sumByKey(listData, 'kuota')));
                            }}
                        />
                    </>
                }
            />

            <TambahDialog
                metadata_id={metadata_id}
                show={showDialogTambah}
                onCancel={() => setShowDialogTambah(false)}
                onRefresh={onRefresh}
            />
            <EditDialog
                metadata_id={metadata_id}
                show={dialogEdit.show}
                name={dialogEdit.name}
                row={dialogEdit.row}
                onCancel={cancelDialogEdit}
                onRefresh={onRefresh}
            />

            <Dialog
                header="Hapus Data Sekolah"
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
                            loading={apiDeleteSekolah.loading}
                        />
                    </>
                }
            >
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>
                        Anda yakin ingin menghapus data sekolah <b>{dialogDelete.name}</b>?
                    </span>
                </div>
            </Dialog>

            <Toast ref={toast} />
        </>
    );
}
