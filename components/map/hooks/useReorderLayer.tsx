import { useMapLibreContext } from '@/components/map/MapLibreContext';
import LoadingState from '@/types/loading-state.enum';
import { Map } from 'maplibre-gl';
import { useEffect } from 'react';

function reorderLayers(map: Map, layerOrder: string[]) {
    for (let i = layerOrder.length - 1; i >= 0; i--) {
        const iLayer = layerOrder[i];
        if (map.getLayer(iLayer)) {
            map.moveLayer(iLayer);
        }
    }
}

type Props = {
    listLayerUid: string[];
};

function useReorderLayer({ listLayerUid }: Props) {
    const { myMap, mapStatus } = useMapLibreContext();

    useEffect(() => {
        if (!myMap) return;
        if (mapStatus !== LoadingState.SUCCESS) return;

        reorderLayers(myMap, listLayerUid);
    }, [myMap, mapStatus, listLayerUid]);
}

export default useReorderLayer;
