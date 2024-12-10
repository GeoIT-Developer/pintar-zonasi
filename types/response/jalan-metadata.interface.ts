export interface JalanMetadataType {
    id: string;
    name: string;
    road_table: string;
    description: string;
    data_status: 'UPLOADED' | 'DEPLOYING' | 'DEPLOYED' | 'FAILED';
    geoserver_status?: 'DEPLOYED' | 'FAILED';
    topology_status?: 'CREATING' | 'CREATED' | 'FAILED';
    bbox: Bbox;
    created_at: string;
    updated_at: string;
}

interface Bbox {
    type: string;
    coordinates: number[][][];
}

export function getStatusSeverity(status: string | undefined | null) {
    switch (status) {
        case 'UPLOADED':
            return 'info';
        case 'CREATING':
        case 'DEPLOYING':
            return 'warning';
        case 'DEPLOYED':
        case 'CREATED':
            return 'success';
        default:
            return 'danger';
    }
}
