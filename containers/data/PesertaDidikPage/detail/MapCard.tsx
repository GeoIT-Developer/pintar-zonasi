import MainMap from '@/components/map';
import usePointLayer from '@/components/map/hooks/usePointLayer';
import { PesertaDidikType } from '@/types/response/peserta-didik-metadata.interface';
import React from 'react';

export default function MapCard({ listData }: { listData: PesertaDidikType[] }) {
    usePointLayer({ jsonData: listData });
    return (
        <div className="col-12">
            <div className="card p-2">
                <MainMap />
            </div>
        </div>
    );
}
