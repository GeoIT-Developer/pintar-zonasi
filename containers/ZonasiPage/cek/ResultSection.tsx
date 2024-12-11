import React, { useState } from 'react';
import { LayerSettingType } from '@/types/layer.type';
import MapCard from './MapCard';
import { SekolahIsoType, ZonasiResponseType } from '@/types/response/zonasi.interface';
import PreviewCSVCard from '@/components/preview/PreviewCSVCard';
import { roundToDecimal } from '@/utils';
import { fetchAI } from '@/utils/fetch-ai';
import { useToastContext } from '@/layout/context/ToastContext';
import { Fieldset } from 'primereact/fieldset';
import { ProgressSpinner } from 'primereact/progressspinner';
import ReactMarkdown from 'react-markdown';

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
    const toast = useToastContext();
    const [sekolahData, setSekolahData] = useState<(SekolahIsoType & { zonasi_label?: string })[]>([]);

    const [kataAI, setKataAI] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    function onResult(res: ZonasiResponseType, coor: { lat: number; lon: number }) {
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

        onRunInsight({ my_lat: coor.lat, my_lon: coor.lon, list_sekolah: eList });
    }

    async function onRunInsight({
        list_sekolah,
        my_lat,
        my_lon,
    }: {
        my_lat: number;
        my_lon: number;
        list_sekolah: SekolahIsoType[];
    }) {
        setIsLoading(true);
        setKataAI('');

        try {
            const theOutput = await fetchAI({
                my_lat,
                my_lon,
                list_sekolah,
            });
            if (theOutput.ok && theOutput.data) {
                setKataAI(theOutput.data);
            } else {
                throw new Error(theOutput.message);
            }
        } catch (err) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error!',
                detail: JSON.stringify(err),
                life: 3000,
            });
            setKataAI('');
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <>
            <MapCard metadata_id={metadata_id} listLayer={listLayer} onResult={onResult} />

            {sekolahData.length > 0 && (
                <>
                    <Fieldset legend="Apa Kata AI?">
                        {isLoading && <ProgressSpinner style={{ width: '50px' }} />}
                        <ReactMarkdown>{kataAI}</ReactMarkdown>
                    </Fieldset>
                    <PreviewCSVCard dataset={sekolahData} column={COLUMN} />
                </>
            )}

            {isLoading && <ProgressSpinner style={{ width: '50px' }} />}
        </>
    );
}
