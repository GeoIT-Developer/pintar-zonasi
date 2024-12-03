import useTermDebounce from '@/hooks/useTermDebounce';
import { ObjectLiteral } from '@/types/object-literal.interface';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import React, { ReactNode, useEffect, useState } from 'react';

type ColumnType = { field: string; label: string };

type Props = {
    dataset: ObjectLiteral[];
    column?: ColumnType[];
    actionColumn?: (row: ObjectLiteral) => ReactNode;
    action?: ReactNode;
    leftAction?: ReactNode;
};

function globalSearch(searchTxt: string, listData: ObjectLiteral[]) {
    const filteredList = listData.filter((item) => {
        const search = searchTxt.toLowerCase();
        let flag = false;

        Object.values(item).forEach((val) => {
            if (String(val).toLowerCase().indexOf(search) > -1) {
                flag = true;
                return;
            }
        });
        if (flag) return item;
    });
    return filteredList;
}

export default function PreviewCSVCard({ dataset, column = [], actionColumn, action, leftAction }: Props) {
    const [header, setHeader] = useState<ColumnType[]>(column);
    const [listData, setListData] = useState<ObjectLiteral[]>([]);
    const [listShownData, setListShownData] = useState<ObjectLiteral[]>([]);
    const [inputSearch, setInputSearch] = useState<string>('');
    const [searchTxt, setSearchTxt] = useTermDebounce('', 350);

    useEffect(() => {
        if (dataset.length > 0) {
            const firstData = dataset[0];
            const listKey = Object.keys(firstData);

            let eNumberDataset = dataset;
            if (!listKey.includes('no')) {
                listKey.unshift('no');
                eNumberDataset = eNumberDataset.map((item, idx) => ({
                    ...item,
                    no: idx + 1,
                }));
            }
            if (!listKey.includes('id')) {
                eNumberDataset = eNumberDataset.map((item, idx) => ({
                    ...item,
                    id: `ID-${idx + 1}`,
                }));
            }
            setListData(eNumberDataset);
            if (column.length === 0) {
                setHeader(listKey.map((key) => ({ field: key, label: key })));
            }
        }
    }, [column.length, dataset]);

    useEffect(() => {
        if (!searchTxt) {
            setListShownData(listData);
        } else {
            const filtered = globalSearch(searchTxt, listData);
            setListShownData(filtered);
        }
    }, [searchTxt, listData]);

    useEffect(() => {
        setSearchTxt(inputSearch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputSearch]);

    return (
        <div className="col-12">
            <div className="card p-2">
                <DataTable
                    value={listShownData}
                    scrollable
                    className="mt-3"
                    paginator
                    rows={10}
                    header={
                        <div className="flex justify-content-between">
                            <div className="flex gap-2">
                                <span className="p-input-icon-left">
                                    <i className="pi pi-search" />
                                    <InputText
                                        value={inputSearch}
                                        onChange={(e) => setInputSearch(e.target.value)}
                                        placeholder="Cari..."
                                        size="small"
                                    />
                                </span>
                                {leftAction}
                            </div>
                            {action}
                        </div>
                    }
                >
                    {header.map((item) => {
                        return (
                            <Column
                                key={item.field}
                                field={item.field}
                                header={item.label}
                                sortable
                                style={{ flexGrow: 1, flexBasis: '150px' }}
                            />
                        );
                    })}
                    {actionColumn && (
                        <Column
                            field="action"
                            header="Aksi"
                            body={actionColumn}
                            frozen
                            style={{ flexGrow: 1, flexBasis: '120px' }}
                            className="font-bold"
                            alignFrozen="right"
                        />
                    )}
                </DataTable>
            </div>
        </div>
    );
}
