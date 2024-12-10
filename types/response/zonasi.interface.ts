import { ObjectLiteral } from '../object-literal.interface';
import { SekolahType } from './sekolah-metadata.interface';

export type SekolahIsoType = SekolahType & { time: number; route?: number; radius?: number; zonasi?: boolean };

export interface ZonasiResponseType {
    isochrone: {
        type: string;
        features: ObjectLiteral[];
    };
    route: {
        type: string;
        features: ObjectLiteral[];
    };
    sekolah: { zonasi: SekolahIsoType[]; non_zonasi: SekolahIsoType[] };
}
