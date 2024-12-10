import MainMap from '@/components/map';
import React from 'react';
import MapMenu from './MapMenu';
import { LayerSettingType } from '@/types/layer.type';
import { ZonasiResponseType } from '@/types/response/zonasi.interface';

type Props = { metadata_id: string; listLayer: LayerSettingType[]; onResult: (res: ZonasiResponseType) => void };

export default function MapCard({ metadata_id, listLayer, onResult }: Props) {
    return (
        <div className="col-8">
            <div className="card p-2">
                <MainMap>
                    <MapMenu metadata_id={metadata_id} listLayer={listLayer} onResult={onResult} />
                </MainMap>
            </div>
        </div>
    );
}
