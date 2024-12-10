export const COOKIE = {
    TOKEN: 'token',
};

export const LOCAL_STORAGE = {
    THEME: 'theme',
    BASEMAP: 'basemap',
    MAP_INITIAL: 'map-initial',
};

export const GEOSERVER_SETTING = {
    WORKSPACE: 'zonasi',
    LAYERS: {
        BATAS_WILAYAH: 'tb_batas_wilayah',
    },
    STYLES: {
        ORANGE_POLYGON: 'orange_polygon',
        BLACK_LINE: 'black_line',
    },
};

export const TINGKATAN_SEKOLAH = {
    SD: {
        id: 'SD/MI',
        label: 'Sekolah Dasar (SD) dan Madrasah Ibtidaiyah (MI)',
    },
    SMP: {
        id: 'SMP/MTs',
        label: 'Sekolah Menengah Pertama (SMP) dan Madrasah Tsanawiyah (MTs)',
    },
    SMA: {
        id: 'SMA/SMK/MA',
        label: 'Sekolah Menengah Atas (SMA), Sekolah Menengah Kejuruan (SMK), dan Madrasah Aliyah (MA)',
    },
};

export const LIST_TINGKATAN_SEKOLAH = Object.values(TINGKATAN_SEKOLAH);

export const KATEGORI_SEKOLAH = {
    NEGERI: {
        id: 'NEGERI',
        label: 'Negeri',
    },
    SWASTA: {
        id: 'SWASTA',
        label: 'Swasta',
    },
};

export const LIST_KATEGORI_SEKOLAH = Object.values(KATEGORI_SEKOLAH);

export const LIST_JENIS_KELAMIN = [
    {
        id: 'Laki-Laki',
        label: 'Laki-Laki',
    },
    {
        id: 'Perempuan',
        label: 'Perempuan',
    },
];

export const LIST_TIPE_PROJECT = [
    {
        id: 'Publik',
        label: 'Publik',
        description: 'Project dengan tipe publik dapat digunakan oleh publik untuk mencari sekolah terdekat',
    },
    {
        id: 'Terbatas',
        label: 'Terbatas',
        description:
            'Project dengan tipe terbatas digunakan secara terbatas oleh pemilik project untuk melakukan perataan peserta didik',
    },
];

export enum DataType {
    BATAS_WILAYAH = 'batas-wilayah',
    JALAN = 'jalan',
    SEKOLAH = 'sekolah',
    PESERTA_DIDIK = 'peserta-didik',
}

export const LAYER_DATA = {
    BATAS_WILAYAH: { id: DataType.BATAS_WILAYAH, label: 'Batas Wilayah' },
    JALAN: { id: DataType.JALAN, label: 'Jalan' },
    SEKOLAH: { id: DataType.SEKOLAH, label: 'Sekolah' },
    PESERTA_DIDIK: { id: DataType.PESERTA_DIDIK, label: 'Peserta Didik' },
};
export const LIST_LAYER_DATA = Object.values(LAYER_DATA);
export function getLayerTypeLabel(id: string) {
    const eFind = LIST_LAYER_DATA.find((item) => item.id === id);
    return eFind?.label || '';
}
