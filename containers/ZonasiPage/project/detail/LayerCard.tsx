import React, { useState } from 'react';
import { Fieldset } from 'primereact/fieldset';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import TambahDialog from './TambahDialog';
import { DataType } from '@/utils/constant';
import { LayerType } from '@/types/layer.type';
import { useToastContext } from '@/layout/context/ToastContext';
import LayerItem from './LayerItem';
import useAPI from '@/hooks/useAPI';
import { ProjectMetadataType } from '@/types/response/project-metadata.interface';
import API from '@/configs/api';

type Props = {
    listLayer: LayerType[];
    setListLayer: React.Dispatch<React.SetStateAction<LayerType[]>>;
    metadata_id: string;
    onRefresh: () => void;
};

export default function LayerCard({ listLayer, setListLayer, metadata_id, onRefresh }: Props) {
    const [showDialogTambah, setShowDialogTambah] = useState(false);
    const toast = useToastContext();

    const apiSaveLayer = useAPI<ProjectMetadataType, { id: string; layers: LayerType[] }>(API.putSaveLayerProject, {
        onError: (err) => {
            toast.current?.show({
                severity: 'error',
                summary: 'Error!',
                detail: err,
                life: 3000,
            });
        },
        onSuccess: () => {
            toast.current?.show({
                severity: 'success',
                summary: 'Saved!',
                detail: 'Layer berhasil disimpan!',
                life: 3000,
            });
            onRefresh();
        },
    });

    function onClickSaveLayer() {
        apiSaveLayer.call({ id: metadata_id, layers: listLayer });
    }

    return (
        <div className="col-4">
            <Fieldset
                legend={
                    <div className="flex align-items-center gap-4">
                        <span className="font-bold">Layer</span>
                        <Button
                            icon="pi pi-plus-circle"
                            label="Tambah Layer"
                            size="small"
                            onClick={() => setShowDialogTambah(true)}
                        />
                    </div>
                }
            >
                <DataView
                    value={listLayer}
                    itemTemplate={(item) => <LayerItem layer={item} setListLayer={setListLayer} />}
                />
                <div className="mt-4">
                    <Button
                        className="w-full"
                        size="small"
                        outlined
                        severity="success"
                        label="Simpan"
                        icon="pi pi-save"
                        onClick={onClickSaveLayer}
                        loading={apiSaveLayer.loading}
                    />
                </div>
            </Fieldset>

            <TambahDialog
                show={showDialogTambah}
                onCancel={() => setShowDialogTambah(false)}
                onAdd={(layer) => {
                    if (layer.type === DataType.JALAN) {
                        const eFind = listLayer.find((it) => it.type === DataType.JALAN);
                        if (eFind) {
                            toast.current?.show({
                                severity: 'error',
                                summary: 'Error!',
                                detail: 'Hanya bisa menambah 1 buah layer jalan!',
                                life: 3000,
                            });
                            return;
                        }
                    }
                    setListLayer((oldState) => {
                        return [...oldState, layer];
                    });
                }}
            />
        </div>
    );
}
