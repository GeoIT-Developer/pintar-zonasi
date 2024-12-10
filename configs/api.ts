import { LayerType } from '@/types/layer.type';
import { ObjectLiteral } from '@/types/object-literal.interface';
import { PesertaDidikType } from '@/types/response/peserta-didik-metadata.interface';
import { SekolahType } from '@/types/response/sekolah-metadata.interface';
import axios from 'axios';

const HOST = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const API = {
    getListBatasWilayah: () => HOST.get(`api/batas-wilayah/`),
    getBatasWilayahDetail: (id: string) => HOST.get(`api/batas-wilayah/${id}/`),
    deleteBatasWilayah: (id: string) => HOST.delete(`api/batas-wilayah/delete/${id}/`),
    postUploadBatasWilayah: ({ description, eFile, name }: { eFile: File; name: string; description: string }) => {
        const formData = new FormData();
        formData.append('file', eFile);
        formData.append('name', name);
        formData.append('description', description);

        return HOST.post(`api/batas-wilayah/upload/`, formData);
    },

    getListSekolah: () => HOST.get(`api/sekolah/`),
    getSekolahDetail: (id: string) => HOST.get(`api/sekolah/${id}/`),
    getListSekolahByMetadata: (id: string) => HOST.get(`api/sekolah/metadata/${id}/`),
    deleteSekolah: (id: string) => HOST.delete(`api/sekolah/delete/${id}/`),
    deleteSekolahDatum: ({ id, metadata_id }: { id: string; metadata_id: string }) =>
        HOST.delete(`api/sekolah/delete/${metadata_id}/${id}/`),
    postUploadSekolah: ({
        description,
        eFile,
        name,
        type,
        level,
        zonasi,
    }: {
        eFile: File;
        name: string;
        description: string;
        level: string;
        type: string;
        zonasi: boolean;
    }) => {
        const formData = new FormData();
        formData.append('file', eFile);
        formData.append('name', name);
        formData.append('level', level);
        formData.append('type', type);
        formData.append('zonasi', String(zonasi));
        formData.append('description', description);

        return HOST.post(`api/sekolah/upload/`, formData);
    },
    postTambahSekolahDatum: ({
        metadata_id,
        tipe,
        npsn,
        nama,
        alamat,
        lat,
        lon,
        kuota,
        keterangan,
    }: Omit<SekolahType, 'id'> & { metadata_id: string }) => {
        const formData = new FormData();
        formData.append('tipe', tipe);
        formData.append('npsn', npsn);
        formData.append('nama', nama);
        formData.append('alamat', alamat);
        formData.append('lat', String(lat));
        formData.append('lon', String(lon));
        formData.append('kuota', String(kuota));
        formData.append('keterangan', keterangan);

        return HOST.post(`api/sekolah/add/${metadata_id}/`, formData);
    },
    putEditSekolahDatum: ({
        id,
        metadata_id,
        tipe,
        npsn,
        nama,
        alamat,
        lat,
        lon,
        kuota,
        keterangan,
    }: SekolahType & { metadata_id: string }) => {
        const formData = new FormData();
        formData.append('tipe', tipe);
        formData.append('npsn', npsn);
        formData.append('nama', nama);
        formData.append('alamat', alamat);
        formData.append('lat', String(lat));
        formData.append('lon', String(lon));
        formData.append('kuota', String(kuota));
        formData.append('keterangan', keterangan);

        return HOST.put(`api/sekolah/edit/${metadata_id}/${id}/`, formData);
    },

    getListPesertaDidik: () => HOST.get(`api/peserta-didik/`),
    getPesertaDidikDetail: (id: string) => HOST.get(`api/peserta-didik/${id}/`),
    getListPesertaDidikByMetadata: (id: string) => HOST.get(`api/peserta-didik/metadata/${id}/`),
    deletePesertaDidik: (id: string) => HOST.delete(`api/peserta-didik/delete/${id}/`),
    deletePesertaDidikDatum: ({ id, metadata_id }: { id: string; metadata_id: string }) =>
        HOST.delete(`api/peserta-didik/delete/${metadata_id}/${id}/`),
    postUploadPesertaDidik: ({
        description,
        eFile,
        name,
        level,
    }: {
        eFile: File;
        name: string;
        level: string;
        description: string;
    }) => {
        const formData = new FormData();
        formData.append('file', eFile);
        formData.append('name', name);
        formData.append('level', level);
        formData.append('description', description);

        return HOST.post(`api/peserta-didik/upload/`, formData);
    },
    postTambahPesertaDidikDatum: ({
        metadata_id,
        nisn,
        nama,
        jenis_kelamin,
        tanggal_lahir,
        alamat,
        lat,
        lon,
        prioritas,
        keterangan,
    }: Omit<PesertaDidikType, 'id'> & { metadata_id: string }) => {
        const formData = new FormData();
        formData.append('nisn', nisn);
        formData.append('nama', nama);
        formData.append('jenis_kelamin', jenis_kelamin);
        formData.append('tanggal_lahir', tanggal_lahir);
        formData.append('alamat', alamat);
        formData.append('lat', String(lat));
        formData.append('lon', String(lon));
        formData.append('prioritas', String(prioritas));
        formData.append('keterangan', keterangan);

        return HOST.post(`api/peserta-didik/add/${metadata_id}/`, formData);
    },
    putEditPesertaDidikDatum: ({
        id,
        metadata_id,
        nisn,
        jenis_kelamin,
        tanggal_lahir,
        nama,
        alamat,
        lat,
        lon,
        prioritas,
        keterangan,
    }: PesertaDidikType & { metadata_id: string }) => {
        const formData = new FormData();
        formData.append('nisn', nisn);
        formData.append('nama', nama);
        formData.append('jenis_kelamin', jenis_kelamin);
        formData.append('tanggal_lahir', tanggal_lahir);
        formData.append('alamat', alamat);
        formData.append('lat', String(lat));
        formData.append('lon', String(lon));
        formData.append('prioritas', String(prioritas));
        formData.append('keterangan', keterangan);

        return HOST.put(`api/peserta-didik/edit/${metadata_id}/${id}/`, formData);
    },

    getListJalan: () => HOST.get(`api/jalan/`),
    getJalanDetail: (id: string) => HOST.get(`api/jalan/${id}/`),
    deleteJalan: (id: string) => HOST.delete(`api/jalan/delete/${id}/`),
    postUploadJalan: ({ description, eFile, name }: { eFile: File; name: string; description: string }) => {
        const formData = new FormData();
        formData.append('file', eFile);
        formData.append('name', name);
        formData.append('description', description);

        return HOST.post(`api/jalan/upload/`, formData);
    },
    putGenerateTopologyJalan: (id: string) => {
        return HOST.put(`api/jalan/generate-topology/${id}/`);
    },
    getRoutingJalan: ({
        id,
        end,
        start,
    }: {
        id: string;
        start: { lat: number; lon: number };
        end: { lat: number; lon: number };
    }) => {
        return HOST.get(`api/jalan/route/${id}/`, {
            params: {
                'start-lat': start.lat,
                'start-lon': start.lon,
                'end-lat': end.lat,
                'end-lon': end.lon,
            },
        });
    },
    getIsochroneJalan: ({
        id,
        lat,
        lon,
        time,
        filter,
    }: {
        id: string;
        lat: number;
        lon: number;
        time: number;
        filter?: string;
    }) => {
        return HOST.get(`api/jalan/isochrone/${id}/`, {
            params: {
                lat,
                lon,
                time,
                filter: filter,
            },
        });
    },

    getListProject: (type?: string) => HOST.get(`api/project/`, { params: { type } }),
    getProjectDetail: (id: string) => HOST.get(`api/project/${id}/`),
    deleteProject: (id: string) => HOST.delete(`api/project/delete/${id}/`),
    postCreateProject: ({
        name,
        description,
        level,
        type,
    }: {
        name: string;
        description: string;
        level: string;
        type: string;
    }) => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('level', level);
        formData.append('type', type);
        formData.append('description', description);

        return HOST.post(`api/project/create/`, formData);
    },
    putSaveLayerProject: ({ id, layers }: { id: string; layers: LayerType[] }) => {
        return HOST.put(`api/project/save-layer/${id}/`, { layers: layers });
    },
    putUpdateStatusProject: ({ id, status }: { id: string; status: string }) => {
        return HOST.put(`api/project/update-status/${id}/${status}/`);
    },

    getListProjectZonasi: (level?: string) => HOST.get(`api/project/zonasi/`, { params: { level } }),
    getMyZonasi: ({ id, lat, lon }: { id: string; lat: number; lon: number }) => {
        return HOST.get(`api/project/zonasi/${id}/`, {
            params: {
                lat,
                lon,
            },
        });
    },
};

export default API;
