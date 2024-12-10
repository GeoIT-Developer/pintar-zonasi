import React, { useEffect } from 'react';
import { DataType, GEOSERVER_SETTING } from '@/utils/constant';
import { LayerType } from '@/types/layer.type';
import useAPI from '@/hooks/useAPI';
import { BatasWilayahMetadataType } from '@/types/response/batas-wilayah-metadata.interface';
import API from '@/configs/api';
import { useToastContext } from '@/layout/context/ToastContext';
import { JalanMetadataType } from '@/types/response/jalan-metadata.interface';
import { PesertaDidikMetadataType } from '@/types/response/peserta-didik-metadata.interface';
import { SekolahMetadataType } from '@/types/response/sekolah-metadata.interface';
import { getBboxFromGeojson } from '@/utils/helper';
import { BBOXType } from '@/types/bbox.type';
import useWMSLayer from '@/components/map/hooks/useWMSLayer';
import usePointLayer from '@/components/map/hooks/usePointLayer';

function BatasWilayahLayer({ detailData, beforeUid }: { detailData: BatasWilayahMetadataType; beforeUid?: string }) {
    useWMSLayer({
        layers: GEOSERVER_SETTING.LAYERS.BATAS_WILAYAH,
        workspace: GEOSERVER_SETTING.WORKSPACE,
        cql_filter: `file_metadata_id=\'${detailData.id}\'`,
        styles: GEOSERVER_SETTING.STYLES.ORANGE_POLYGON,
        bbox: getBboxFromGeojson(detailData.bbox) as BBOXType,
        clickable: false,
        fitbounds: false,
        beforeLayer: beforeUid,
        uid: detailData.id,
    });
    return <></>;
}
function JalanLayer({ detailData, beforeUid }: { detailData: JalanMetadataType; beforeUid?: string }) {
    useWMSLayer({
        layers: detailData.road_table,
        workspace: GEOSERVER_SETTING.WORKSPACE,
        styles: GEOSERVER_SETTING.STYLES.BLACK_LINE,
        bbox: getBboxFromGeojson(detailData.bbox) as BBOXType,
        clickable: false,
        fitbounds: false,
        beforeLayer: beforeUid,
        uid: detailData.id,
    });
    return <></>;
}
function SekolahLayer({
    detailData,
    beforeUid,
    layer,
}: {
    detailData: SekolahMetadataType;
    beforeUid?: string;
    layer: LayerType;
}) {
    usePointLayer({
        jsonData: detailData.data || [],
        label: 'nama',
        fitbounds: false,
        beforeLayer: beforeUid,
        uid: detailData.id,
        circleColor: layer.color,
    });
    return <></>;
}
function PesertaDidikLayer({
    detailData,
    beforeUid,
    layer,
}: {
    detailData: PesertaDidikMetadataType;
    beforeUid?: string;
    layer: LayerType;
}) {
    usePointLayer({
        jsonData: detailData.data || [],
        fitbounds: false,
        beforeLayer: beforeUid,
        uid: detailData.id,
        circleColor: layer.color,
    });
    return <></>;
}

type Props = {
    layer: LayerType;
    beforeUid?: string;
};

export default function LayerSetting({ layer, beforeUid }: Props) {
    const toast = useToastContext();

    function onError(err: any) {
        toast.current?.show({
            severity: 'error',
            summary: 'Error!',
            detail: err,
            life: 3000,
        });
    }

    const apiBatasWilayahDetail = useAPI<BatasWilayahMetadataType, string>(API.getBatasWilayahDetail, {
        onError: (err) => {
            onError(err);
        },
    });

    const apiJalanDetail = useAPI<JalanMetadataType, string>(API.getJalanDetail, {
        onError: (err) => {
            onError(err);
        },
    });

    const apiPesertaDidikDetail = useAPI<PesertaDidikMetadataType, string>(API.getListPesertaDidikByMetadata, {
        onError: (err) => {
            onError(err);
        },
    });

    const apiSekolahDetail = useAPI<SekolahMetadataType, string>(API.getListSekolahByMetadata, {
        onError: (err) => {
            onError(err);
        },
    });

    useEffect(() => {
        if (layer.type === DataType.BATAS_WILAYAH) {
            apiBatasWilayahDetail.call(layer.id);
        } else if (layer.type === DataType.JALAN) {
            apiJalanDetail.call(layer.id);
        } else if (layer.type === DataType.PESERTA_DIDIK) {
            apiPesertaDidikDetail.call(layer.id);
        } else if (layer.type === DataType.SEKOLAH) {
            apiSekolahDetail.call(layer.id);
        }
    }, [layer]);

    return (
        <>
            {layer.type === DataType.BATAS_WILAYAH && apiBatasWilayahDetail.data && (
                <BatasWilayahLayer detailData={apiBatasWilayahDetail.data} key={layer.id} beforeUid={beforeUid} />
            )}
            {layer.type === DataType.JALAN && apiJalanDetail.data && (
                <JalanLayer detailData={apiJalanDetail.data} key={layer.id} beforeUid={beforeUid} />
            )}
            {layer.type === DataType.SEKOLAH && apiSekolahDetail.data && (
                <SekolahLayer detailData={apiSekolahDetail.data} key={layer.id} beforeUid={beforeUid} layer={layer} />
            )}
            {layer.type === DataType.PESERTA_DIDIK && apiPesertaDidikDetail.data && (
                <PesertaDidikLayer
                    detailData={apiPesertaDidikDetail.data}
                    key={layer.id}
                    beforeUid={beforeUid}
                    layer={layer}
                />
            )}
        </>
    );
}
