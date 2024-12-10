import MainMap from '@/components/map';
import useWMSLayer from '@/components/map/hooks/useWMSLayer';
import { BBOXType } from '@/types/bbox.type';
import { BatasWilayahMetadataType } from '@/types/response/batas-wilayah-metadata.interface';
import { GEOSERVER_SETTING } from '@/utils/constant';
import { getBboxFromGeojson } from '@/utils/helper';
import React, { useEffect, useState } from 'react';

export default function MapCard({
    metadata_id,
    detailData,
}: {
    metadata_id: string;
    detailData: BatasWilayahMetadataType | null;
}) {
    const [bbox, setBbox] = useState<BBOXType>();

    useWMSLayer({
        layers: GEOSERVER_SETTING.LAYERS.BATAS_WILAYAH,
        workspace: GEOSERVER_SETTING.WORKSPACE,
        cql_filter: `file_metadata_id=\'${metadata_id}\'`,
        styles: GEOSERVER_SETTING.STYLES.ORANGE_POLYGON,
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
