export const COOKIE = {
    TOKEN: 'token',
};

export const LOCAL_STORAGE = {
    THEME: 'theme',
    BASEMAP: 'basemap',
    MAP_INITIAL: 'map-initial',
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
