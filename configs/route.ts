export const ROUTE = {
    HOME: {
        URL: '/'
    },
    DATA: {
        URL: '/data',
        BATAS_WILAYAH: {
            URL: '/data/batas-wilayah',
            UNGGAH: {
                URL: '/data/batas-wilayah/unggah'
            },
            DETAIL: {
                URL: '/data/batas-wilayah/[metadata_id]',
                setURL: (metadata_id: string) => `/data/batas-wilayah/${metadata_id}`
            }
        },
        JALAN: {
            URL: '/data/jalan',
            UNGGAH: {
                URL: '/data/jalan/unggah'
            },
            DETAIL: {
                URL: '/data/jalan/[metadata_id]',
                setURL: (metadata_id: string) => `/data/jalan/${metadata_id}`
            }
        },
        SEKOLAH: {
            URL: '/data/sekolah',
            UNGGAH: {
                URL: '/data/sekolah/unggah'
            },
            DETAIL: {
                URL: '/data/sekolah/[metadata_id]',
                setURL: (metadata_id: string) => `/data/sekolah/${metadata_id}`
            }
        },
        PESERTA_DIDIK: {
            URL: '/data/peserta-didik',
            UNGGAH: {
                URL: '/data/peserta-didik/unggah'
            },
            DETAIL: {
                URL: '/data/peserta-didik/[metadata_id]',
                setURL: (metadata_id: string) => `/data/peserta-didik/${metadata_id}`
            }
        }
    }
};
