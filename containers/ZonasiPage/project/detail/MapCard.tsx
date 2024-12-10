import MainMap from '@/components/map';
import React from 'react';

export default function MapCard() {
    return (
        <div className="col-8">
            <div className="card p-2">
                <MainMap />
            </div>
        </div>
    );
}
