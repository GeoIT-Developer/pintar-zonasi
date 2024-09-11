import { ReactNode } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import LoadingState from '@/types/loading-state.enum';
import { useMapLibreContext } from './MapLibreContext';
import { ProgressSpinner } from 'primereact/progressspinner';
import ResizableDiv from '../resizable/ResizableDiv';

export default function MainMap({ children, isLoading, className = '' }: { children?: ReactNode; isLoading?: boolean; className?: string }) {
    const { mapContainer, mapStatus } = useMapLibreContext();

    return (
        <ResizableDiv className={`relative w-full min-h-30rem ${className}`} width="w-full" height="30rem">
            {mapStatus !== LoadingState.UNDEFINED && children}
            {(mapStatus === LoadingState.LOADING || isLoading) && (
                <ProgressSpinner
                    className="absolute top-50 left-50 z-5"
                    style={{
                        transform: 'translate(-50%, -50%)',
                        width: '50px',
                        height: '50px'
                    }}
                    strokeWidth="8"
                    animationDuration=".8s"
                />
            )}

            <div ref={mapContainer} className={`w-full h-full border-round-lg`} />
        </ResizableDiv>
    );
}
