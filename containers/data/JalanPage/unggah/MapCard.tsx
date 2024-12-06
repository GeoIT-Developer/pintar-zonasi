import MainMap from '@/components/map';
import useLineLayer from '@/components/map/hooks/useLineLayer';
import { ObjectLiteral } from '@/types/object-literal.interface';
import React from 'react';

export default function MapCard({ geojsonData, inputFile }: { geojsonData: ObjectLiteral; inputFile: File }) {
    useLineLayer({ geojsonData, lineColor: '#333', lineWidth: 1 });

    return (
        <div className="col-12">
            <div className="card p-2">
                <h4 className="border-bottom-1">{inputFile?.name}</h4>
                <MainMap />
            </div>
        </div>
    );
}
