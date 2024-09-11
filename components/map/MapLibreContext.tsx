import LoadingState from '@/types/loading-state.enum';
import { GeolocateControl, Map } from 'maplibre-gl';
import { ReactNode, RefObject, createContext, useContext } from 'react';
import useMapLibre from './useMapLibre';

type MapLibreType = {
    mapContainer: RefObject<HTMLDivElement> | null;
    mapStatus: LoadingState;
    myMap: Map | null;
    geoControl: GeolocateControl | undefined;
};

const MapLibreContext = createContext<MapLibreType>({
    mapContainer: null,
    mapStatus: LoadingState.UNDEFINED,
    myMap: null,
    geoControl: undefined
});

export const MapLibreProvider = ({ children }: { children: ReactNode }) => {
    const mapLibre = useMapLibre();
    return <MapLibreContext.Provider value={mapLibre}>{children}</MapLibreContext.Provider>;
};

export const useMapLibreContext = () => {
    const context = useContext(MapLibreContext);
    return context;
};
