import MainMap from '@/components/map';
import usePolygonLayer from '@/components/map/hooks/usePolygonLayer';
import { ObjectLiteral } from '@/types/object-literal.interface';
import React from 'react';

export default function MapCard({ geojsonData, inputFile }: { geojsonData: ObjectLiteral; inputFile: File }) {
    usePolygonLayer({ geojsonData });

    return (
        <div className="col-12">
            <div className="card p-2">
                <h4 className="border-bottom-1">{inputFile?.name}</h4>
                <MainMap />
            </div>
        </div>
    );
}
