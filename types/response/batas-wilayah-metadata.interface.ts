export interface BatasWilayahMetadataType {
    id: string;
    name: string;
    description: string;
    bbox: Bbox;
    created_at: string;
    updated_at: string;
}

interface Bbox {
    type: string;
    coordinates: number[][][];
}
