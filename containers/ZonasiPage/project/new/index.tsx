'use client';

import API from '@/configs/api';
import { ROUTE } from '@/configs/route';
import useAPI from '@/hooks/useAPI';
import { ObjectLiteral } from '@/types/object-literal.interface';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { LIST_TINGKATAN_SEKOLAH, LIST_TIPE_PROJECT } from '@/utils/constant';
import { useToastContext } from '@/layout/context/ToastContext';

const THIS_ROUTE = ROUTE.ZONASI;

type ProjectType = { name: string; description: string; level: string; type: string };

export default function NewProjectPage() {
    const router = useRouter();
    const toast = useToastContext();
    const [inputData, setInputData] = useState<ProjectType>({ name: '', description: '', level: '', type: '' });

    const apiBuatProject = useAPI<ObjectLiteral, ProjectType>(API.postCreateProject, {
        onSuccess: () => {
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Project berhasil dibuat!',
            });
            setTimeout(() => {
                router.push(THIS_ROUTE.URL);
            }, 1500);
        },
        onError: (err) => {
            toast.current?.show({
                severity: 'error',
                summary: 'Error!',
                detail: err,
            });
        },
    });

    function onClickCreate() {
        if (!inputData.name || !inputData.level || !inputData.type) return;
        apiBuatProject.call(inputData);
        toast.current?.show({
            severity: 'info',
            summary: 'Membuat project...',
            life: 5000,
        });
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5 className="mb-0">Buat Project Baru</h5>
                </div>
            </div>
            <div className="col-12">
                <div className="card p-fluid">
                    <div className="field">
                        <label htmlFor="name">Nama</label>
                        <InputText
                            id="name"
                            type="text"
                            value={inputData.name}
                            onChange={(e) => {
                                const eVal = e.target.value;
                                if (eVal.length > 50) return;
                                setInputData((oldState) => {
                                    return { ...oldState, name: eVal };
                                });
                            }}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="level">Tingkatan</label>
                        <Dropdown
                            id="level"
                            value={inputData.level}
                            onChange={(e) => {
                                const eVal = e.value;
                                setInputData((oldState) => {
                                    return { ...oldState, level: eVal };
                                });
                            }}
                            options={LIST_TINGKATAN_SEKOLAH}
                            optionLabel="id"
                            optionValue="id"
                            placeholder="-- Pilih Tingkatan --"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="tipe">Tipe</label>
                        <Dropdown
                            id="tipe"
                            value={inputData.type}
                            onChange={(e) => {
                                const eVal = e.value;
                                setInputData((oldState) => {
                                    return { ...oldState, type: eVal };
                                });
                            }}
                            options={LIST_TIPE_PROJECT}
                            optionLabel="id"
                            optionValue="id"
                            placeholder="-- Pilih Tipe --"
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="deskripsi">Deskripsi</label>
                        <InputTextarea
                            id="deskripsi"
                            rows={3}
                            value={inputData.description}
                            onChange={(e) => {
                                const eVal = e.target.value;
                                if (eVal.length > 250) return;
                                setInputData((oldState) => {
                                    return { ...oldState, description: eVal };
                                });
                            }}
                        />
                    </div>

                    <div className="w-full text-right">
                        <Button
                            icon="pi pi-upload"
                            label="Buat Project"
                            className="w-fit"
                            disabled={!inputData.name || !inputData.level || !inputData.type}
                            onClick={onClickCreate}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
