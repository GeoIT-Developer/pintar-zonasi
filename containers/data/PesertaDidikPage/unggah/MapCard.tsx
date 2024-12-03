import MainMap from '@/components/map';
import usePointLayer from '@/components/map/hooks/usePointLayer';
import { ObjectLiteral } from '@/types/object-literal.interface';
import React from 'react';

export default function MapCard({ jsonData, inputFile }: { jsonData: ObjectLiteral[]; inputFile: File }) {
    usePointLayer({ jsonData });

    return (
        <div className="col-12">
            <div className="card p-2">
                <h4 className="border-bottom-1">{inputFile?.name}</h4>
                <MainMap />
            </div>
        </div>
    );
}
