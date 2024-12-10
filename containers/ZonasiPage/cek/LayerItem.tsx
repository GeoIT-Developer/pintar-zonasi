import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { DataType, getLayerTypeLabel } from '@/utils/constant';
import { LayerSettingType } from '@/types/layer.type';
import { ColorPicker } from 'primereact/colorpicker';
import { Menu } from 'primereact/menu';

type Props = {
    layer: LayerSettingType;
    setListLayer: React.Dispatch<React.SetStateAction<LayerSettingType[]>>;
};

export default function LayerItem({ layer, setListLayer }: Props) {
    const menuRight = useRef<Menu>(null);

    const menuButton = [
        {
            label: layer.show ? 'Sembunyikan' : 'Tampilkan',
            icon: layer.show ? 'pi pi-eye-slash' : 'pi pi-eye',
            command: () => {
                setListLayer((oldState) => {
                    return oldState.map((lyr) => (lyr.id === layer.id ? { ...lyr, show: !lyr.show } : lyr));
                });
            },
        },
    ];
    if (layer.type === DataType.SEKOLAH) {
        menuButton.push({
            label: layer.showLabel ? 'Sembunyikan Label' : 'Tampilkan Label',
            icon: layer.showLabel ? 'pi pi-eye-slash' : 'pi pi-eye',
            command: () => {
                setListLayer((oldState) => {
                    return oldState.map((lyr) => (lyr.id === layer.id ? { ...lyr, showLabel: !lyr.showLabel } : lyr));
                });
            },
        });
    }

    return (
        <div className="col-12 flex align-items-center gap-2 justify-content-between mb-2">
            <div className="flex align-items-center gap-2">
                <ColorPicker
                    format="hex"
                    value={layer.color}
                    onChange={(e) => {
                        const eVal = (e.value as string) || '';
                        setListLayer((oldState) => {
                            const newState = [...oldState];
                            const idx = oldState.findIndex((it) => it.id === layer.id);
                            newState[idx].color = `#${eVal}`;
                            return newState;
                        });
                    }}
                    disabled={layer.type === DataType.BATAS_WILAYAH || layer.type === DataType.JALAN}
                />
                <div>
                    <strong>{layer.name}</strong>
                    <br />
                    <small>{getLayerTypeLabel(layer.type)}</small>
                </div>
            </div>
            <div>
                <Menu model={menuButton} popup ref={menuRight} id="popup_menu_right" popupAlignment="right" />
                <Button
                    size="small"
                    severity="secondary"
                    text
                    icon="pi pi-ellipsis-v"
                    onClick={(event) => menuRight.current?.toggle(event)}
                    aria-controls="popup_menu_right"
                    aria-haspopup
                />
            </div>
        </div>
    );
}
