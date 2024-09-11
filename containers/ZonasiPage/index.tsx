'use client';

import MainMap from '@/components/map';
import BasemapProvider from '@/components/map/BasemapContext';
import { MapLibreProvider } from '@/components/map/MapLibreContext';
import React from 'react';

export default function ZonasiPage() {
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card p-2">
                    <BasemapProvider>
                        <MapLibreProvider>
                            <MainMap />
                        </MapLibreProvider>
                    </BasemapProvider>
                </div>
            </div>
        </div>
    );
}
