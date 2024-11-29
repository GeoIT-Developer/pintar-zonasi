import MainMap from '@/components/map';
import usePointLayer from '@/components/map/hooks/usePointLayer';
import { SekolahMetadataType } from '@/types/response/sekolah-metadata.interface';
import React from 'react';

export default function MapCard({ detailData }: { detailData: SekolahMetadataType | null }) {
    usePointLayer({ jsonData: detailData?.data || [], label: 'nama' });

    return (
        <div className="col-12">
            <div className="card p-2">
                <MainMap />
            </div>
        </div>
    );
}
