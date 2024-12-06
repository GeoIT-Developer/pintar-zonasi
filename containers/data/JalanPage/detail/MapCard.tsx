import MainMap from '@/components/map';
import useWMSLayer from '@/components/map/hooks/useWMSLayer';
import { BBOXType } from '@/types/bbox.type';
import { JalanMetadataType } from '@/types/response/jalan-metadata.interface';
import { getBboxFromGeojson } from '@/utils/helper';
import React, { useEffect, useState } from 'react';

export default function MapCard({ detailData }: { detailData: JalanMetadataType }) {
    const [bbox, setBbox] = useState<BBOXType>();

    useWMSLayer({
        layers: detailData?.road_table,
        workspace: 'zonasi',
        styles: 'black_line',
        bbox: bbox,
        clickable: false,
    });

    useEffect(() => {
        if (!detailData) return;
        const eBbox = getBboxFromGeojson(detailData.bbox);
        setBbox(eBbox as BBOXType);
    }, [detailData]);

    return (
        <div className="col-12">
            <div className="card p-2">
                <MainMap />
            </div>
        </div>
    );
}
