import { DataType } from '@/utils/constant';

export type LayerType = { id: string; type: DataType; name: string; color: string };
export type LayerSettingType = LayerType & { show?: boolean; showLabel?: boolean };
