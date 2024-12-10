import React, { useState } from 'react';
import { LayerSettingType } from '@/types/layer.type';
import MapCard from './MapCard';
import { SekolahIsoType, ZonasiResponseType } from '@/types/response/zonasi.interface';
import PreviewCSVCard from '@/components/preview/PreviewCSVCard';
import { roundToDecimal } from '@/utils';

const COLUMN = [
    { field: 'no', label: 'No' },
    { field: 'tipe', label: 'Tipe' },
    { field: 'npsn', label: 'NPSN' },
    { field: 'nama', label: 'Nama' },
    { field: 'alamat', label: 'Alamat' },
    { field: 'zonasi_label', label: 'Zonasi' },
    { field: 'time', label: 'Waktu (menit)' },
    { field: 'radius', label: 'Radius (meter)' },
    { field: 'route', label: 'Jarak (km)' },
    { field: 'kuota', label: 'Kuota' },
    { field: 'keterangan', label: 'Keterangan' },
    { field: 'lat', label: 'Lat' },
    { field: 'lon', label: 'Lon' },
];

type Props = { metadata_id: string; listLayer: LayerSettingType[] };
export default function ResultSection({ listLayer, metadata_id }: Props) {
    const [sekolahData, setSekolahData] = useState<(SekolahIsoType & { zonasi_label?: string })[]>([]);

    function onResult(res: ZonasiResponseType) {
        const eList: (SekolahIsoType & { zonasi_label?: string })[] = [];
        res?.sekolah?.zonasi?.forEach((item) => {
            eList.push({
                ...item,
                zonasi: true,
                zonasi_label: 'Ya',
                radius: roundToDecimal(item.radius || 0, 1),
                route: roundToDecimal(item.route || 0, 1),
            });
        });
        res?.sekolah?.non_zonasi?.forEach((item) => {
            eList.push({ ...item, zonasi: false });
        });
        setSekolahData(eList);
    }
    return (
        <>
            <MapCard metadata_id={metadata_id} listLayer={listLayer} onResult={onResult} />

            {sekolahData.length > 0 && <PreviewCSVCard dataset={sekolahData} column={COLUMN} />}
        </>
    );
}
