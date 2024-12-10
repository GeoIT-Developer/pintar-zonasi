import { LayerType } from '../layer.type';
import { ObjectLiteral } from '../object-literal.interface';

export interface ProjectMetadataType {
    id: string;
    name: string;
    level: string;
    type: string;
    description: string;
    layers?: LayerType[];
    status: 'DRAFT' | 'PUBLISHED';
    bbox?: Bbox;
    created_at: string;
    updated_at: string;
}

interface Bbox {
    type: string;
    coordinates: number[][][];
}

export function getStatusSeverity(status: string | undefined | null) {
    switch (status) {
        case 'DRAFT':
            return 'warning';
        case 'PUBLISHED':
            return 'success';
        default:
            return 'danger';
    }
}
