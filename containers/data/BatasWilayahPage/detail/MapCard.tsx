import MainMap from '@/components/map';
import useWMSLayer from '@/components/map/hooks/useWMSLayer';
import { BBOXType } from '@/types/bbox.type';
import { BatasWilayahMetadataType } from '@/types/response/batas-wilayah-metadata.interface';
import { getBboxFromGeojson } from '@/utils/helper';
import React, { useEffect, useState } from 'react';

export default function MapCard({ metadata_id, detailData }: { metadata_id: string; detailData: BatasWilayahMetadataType | null }) {
    const [bbox, setBbox] = useState<BBOXType>();

    useWMSLayer({
        layers: 'tb_batas_wilayah',
        workspace: 'zonasi',
        cql_filter: `file_metadata_id=\'${metadata_id}\'`,
        styles: 'orange_polygon',
        bbox: bbox,
        clickable: true,
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
