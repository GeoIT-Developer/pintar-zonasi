import React, { useEffect, useState } from 'react';
import { LayerType } from '@/types/layer.type';
import MapCard from './MapCard';
import LayerCard from './LayerCard';
import LayerSetting from './LayerSetting';
import { DataType } from '@/utils/constant';
import { getWMSLayerUid } from '@/components/map/hooks/useWMSLayer';
import { getPointLayerUid } from '@/components/map/hooks/usePointLayer';

export default function ContentSection({
    metadata_id,
    layers,
    onRefresh,
}: {
    metadata_id: string;
    layers: LayerType[];
    onRefresh: () => void;
}) {
    const [listLayer, setListLayer] = useState<LayerType[]>([]);

    useEffect(() => {
        if (layers) {
            setListLayer(layers);
        }
    }, [layers]);

    return (
        <>
            {listLayer.map((item, idx) => {
                const beforeLayer = listLayer[idx - 1];
                let beforeUid: string | undefined = undefined;
                if (beforeLayer) {
                    if (beforeLayer.type === DataType.BATAS_WILAYAH || beforeLayer.type === DataType.JALAN) {
                        beforeUid = getWMSLayerUid(beforeLayer.id);
                    } else if (beforeLayer.type === DataType.PESERTA_DIDIK || beforeLayer.type === DataType.SEKOLAH) {
                        beforeUid = getPointLayerUid(beforeLayer.id);
                    }
                }

                return <LayerSetting layer={item} key={item.id} beforeUid={beforeUid} />;
            })}
            <LayerCard
                listLayer={listLayer}
                setListLayer={setListLayer}
                metadata_id={metadata_id}
                onRefresh={onRefresh}
            />
            <MapCard />
        </>
    );
}
