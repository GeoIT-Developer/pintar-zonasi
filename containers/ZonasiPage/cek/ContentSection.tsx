import React, { useEffect, useState } from 'react';
import { LayerType } from '@/types/layer.type';
import LayerCard from './LayerCard';
import LayerSetting from './LayerSetting';
import { DataType } from '@/utils/constant';
import { getWMSLayerUid } from '@/components/map/hooks/useWMSLayer';
import { getPointLayerUid } from '@/components/map/hooks/usePointLayer';
import ResultSection from './ResultSection';

export default function ContentSection({ layers, metadata_id }: { layers: LayerType[]; metadata_id: string }) {
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
            <LayerCard listLayer={listLayer} setListLayer={setListLayer} />
            <ResultSection metadata_id={metadata_id} listLayer={listLayer} />
        </>
    );
}
