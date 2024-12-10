import React, { useEffect, useState } from 'react';
import { Fieldset } from 'primereact/fieldset';
import { DataView } from 'primereact/dataview';
import { LayerSettingType } from '@/types/layer.type';
import LayerItem from './LayerItem';
import { DataType } from '@/utils/constant';
import { getWMSLayerUid } from '@/components/map/hooks/useWMSLayer';
import { getPointLabelLayerUid, getPointLayerUid } from '@/components/map/hooks/usePointLayer';
import useReorderLayer from '@/components/map/hooks/useReorderLayer';

type Props = {
    listLayer: LayerSettingType[];
    setListLayer: React.Dispatch<React.SetStateAction<LayerSettingType[]>>;
};

export default function LayerCard({ listLayer, setListLayer }: Props) {
    const [listLayerUid, setListLayerUid] = useState<string[]>([]);

    useEffect(() => {
        const eListLayer: string[] = [];
        listLayer.forEach((item) => {
            if (item.show) {
                if (item.type === DataType.BATAS_WILAYAH || item.type === DataType.JALAN) {
                    eListLayer.push(getWMSLayerUid(item.id));
                } else if (item.type === DataType.PESERTA_DIDIK || item.type === DataType.SEKOLAH) {
                    if (item.showLabel) {
                        eListLayer.push(getPointLabelLayerUid(item.id));
                    }
                    eListLayer.push(getPointLayerUid(item.id));
                }
            }
        });
        setListLayerUid(eListLayer);
    }, [listLayer]);

    useReorderLayer({ listLayerUid: listLayerUid });

    return (
        <div className="col-4">
            <Fieldset
                legend={
                    <div className="flex align-items-center gap-4">
                        <span className="font-bold">Layer</span>
                    </div>
                }
            >
                <DataView
                    value={listLayer}
                    itemTemplate={(item) => <LayerItem layer={item} setListLayer={setListLayer} />}
                />
            </Fieldset>
        </div>
    );
}
