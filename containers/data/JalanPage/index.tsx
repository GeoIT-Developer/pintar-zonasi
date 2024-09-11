'use client';

import { CustomerService } from '@/demo/service/CustomerService';
import { Demo } from '@/types';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';

const getCustomers = (data: Demo.Customer[]) => {
    return [...(data || [])].map((d) => {
        d.date = new Date(d.date);
        return d;
    });
};

const formatDate = (value: Date) => {
    return value.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    });
};

export default function JalanPage() {
    const [customers2, setCustomers2] = useState<Demo.Customer[]>([]);
    const [loading2, setLoading2] = useState(true);

    useEffect(() => {
        setLoading2(true);

        CustomerService.getCustomersLarge().then((data) => {
            setCustomers2(getCustomers(data));
            setLoading2(false);
        });
    }, []);

    const countryBodyTemplate = (rowData: Demo.Customer) => {
        return (
            <React.Fragment>
                <img alt="flag" src={`/demo/images/flag/flag_placeholder.png`} className={`flag flag-${rowData.country.code}`} width={30} />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }}>{rowData.country.name}</span>
            </React.Fragment>
        );
    };

    const representativeBodyTemplate = (rowData: Demo.Customer) => {
        const representative = rowData.representative;
        return (
            <React.Fragment>
                <img
                    alt={representative.name}
                    src={`/demo/images/avatar/${representative.image}`}
                    onError={(e) => ((e.target as HTMLImageElement).src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')}
                    width={32}
                    style={{ verticalAlign: 'middle' }}
                />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }}>{representative.name}</span>
            </React.Fragment>
        );
    };

    const dateBodyTemplate = (rowData: Demo.Customer) => {
        return formatDate(rowData.date);
    };

    const statusBodyTemplate = (rowData: Demo.Customer) => {
        return <span className={`customer-badge status-${rowData.status}`}>{rowData.status}</span>;
    };

    const balanceTemplate = (rowData: Demo.Customer) => {
        return (
            <div>
                <span className="text-bold">{formatCurrency(rowData.balance as number)}</span>
            </div>
        );
    };

    const renderHeader1 = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Tambah Data" outlined></Button>
            </div>
        );
    };

    const header1 = renderHeader1();

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Data Jalan</h5>
                    <p>
                        Data jalan yang bersumber dari OSM dan dapat diunduh melalui link berikut :{' '}
                        <a href="https://download.geofabrik.de/asia/indonesia.html" target="_blank">
                            OSM Geofabrik Indonesia
                        </a>
                    </p>
                </div>
            </div>

            <div className="col-12">
                <div className="card">
                    <DataTable value={customers2} scrollable scrollHeight="400px" loading={loading2} className="mt-3" header={header1}>
                        <Column field="name" header="Name" sortable style={{ flexGrow: 1, flexBasis: '160px' }} frozen className="font-bold"></Column>
                        <Column field="id" header="Id" style={{ flexGrow: 1, flexBasis: '100px' }} alignFrozen="left"></Column>
                        <Column field="country.name" header="Country" sortable style={{ flexGrow: 1, flexBasis: '200px' }} body={countryBodyTemplate}></Column>
                        <Column field="date" header="Date" style={{ flexGrow: 1, flexBasis: '200px' }} body={dateBodyTemplate}></Column>
                        <Column field="company" header="Company" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
                        <Column field="status" header="Status" style={{ flexGrow: 1, flexBasis: '200px' }} body={statusBodyTemplate}></Column>
                        <Column field="activity" header="Activity" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
                        <Column field="representative.name" header="Representative" style={{ flexGrow: 1, flexBasis: '200px' }} body={representativeBodyTemplate}></Column>
                        <Column field="balance" header="Balance" body={balanceTemplate} frozen style={{ flexGrow: 1, flexBasis: '120px' }} className="font-bold" alignFrozen="right"></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
}
