'use client';

import LoadingState from '@/types/loading-state.enum';
import { GeolocateControl, Map, MapOptions } from 'maplibre-gl';
import { ReactNode, RefObject, createContext, useContext } from 'react';
import useMapLibre from './useMapLibre';

type MapLibreType = {
    mapContainer: RefObject<HTMLDivElement> | null;
    mapStatus: LoadingState;
    myMap: Map | null;
    geoControl: GeolocateControl | undefined;
};

const MapLibreContext = createContext<MapLibreType | undefined>(undefined);

export const MapLibreProvider = ({ children, options, triggerUserLocation }: { children: ReactNode; options?: MapOptions; triggerUserLocation?: boolean }) => {
    const mapLibre = useMapLibre(options, triggerUserLocation);
    return <MapLibreContext.Provider value={mapLibre}>{children}</MapLibreContext.Provider>;
};

export const useMapLibreContext = () => {
    const context = useContext(MapLibreContext);
    if (!context) {
        throw new Error('useMapLibreContext must be used within a MapLibreContext');
    }
    return context;
};
