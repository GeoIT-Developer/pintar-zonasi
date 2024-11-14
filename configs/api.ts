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
};

export default API;
