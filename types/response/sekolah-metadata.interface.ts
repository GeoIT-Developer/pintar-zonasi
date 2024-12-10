export interface SekolahMetadataType {
    id: string;
    name: string;
    description: string;
    type: string;
    zonasi: boolean;
    level: string;
    bbox: Bbox;
    created_at: string;
    updated_at: string;
    data?: SekolahType[];
}

interface Bbox {
    type: string;
    coordinates: number[][][];
}

export interface SekolahType {
    id: number;
    tipe: string;
    npsn: string;
    nama: string;
    alamat: string;
    kuota: number;
    keterangan: string;
    lat: number;
    lon: number;
}
