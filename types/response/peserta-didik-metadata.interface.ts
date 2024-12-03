export interface PesertaDidikMetadataType {
    id: string;
    name: string;
    level: string;
    description: string;
    bbox: Bbox;
    created_at: string;
    updated_at: string;
    data?: PesertaDidikType[];
}

interface Bbox {
    type: string;
    coordinates: number[][][];
}

export interface PesertaDidikType {
    id: number;
    nisn: string;
    nama: string;
    jenis_kelamin: string;
    tanggal_lahir: string;
    alamat: string;
    prioritas: number;
    keterangan: string;
    lat: number;
    lon: number;
}
