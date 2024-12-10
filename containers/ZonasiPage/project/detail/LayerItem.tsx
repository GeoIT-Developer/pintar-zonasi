import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { DataType, getLayerTypeLabel } from '@/utils/constant';
import { LayerType } from '@/types/layer.type';
import { ColorPicker } from 'primereact/colorpicker';
import { Menu } from 'primereact/menu';

type Props = {
    layer: LayerType;
    setListLayer: React.Dispatch<React.SetStateAction<LayerType[]>>;
    disableDelete?: boolean;
};

export default function LayerItem({ layer, setListLayer, disableDelete }: Props) {
    const menuRight = useRef<Menu>(null);

    const menuButton = [
        {
            label: 'Pindah Atas',
            icon: 'pi pi-caret-up',
            command: () => {
                setListLayer((oldState) => {
                    const newState = [...oldState];
                    const idx = oldState.findIndex((it) => it.id === layer.id);
                    if (idx > 0) {
                        [newState[idx - 1], newState[idx]] = [newState[idx], newState[idx - 1]]; // Swap with the previous layer
                    }
                    return newState;
                });
            },
        },
        {
            label: 'Pindah Bawah',
            icon: 'pi pi-caret-down',
            command: () => {
                setListLayer((oldState) => {
                    const newState = [...oldState];
                    const idx = oldState.findIndex((it) => it.id === layer.id);
                    if (idx < newState.length - 1) {
                        [newState[idx + 1], newState[idx]] = [newState[idx], newState[idx + 1]]; // Swap with the previous layer
                    }
                    return newState;
                });
            },
        },
    ];
    if (!disableDelete) {
        menuButton.push({
            label: 'Hapus',
            icon: 'pi pi-times',
            command: () => {
                setListLayer((oldState) => {
                    const newState = oldState.filter((it) => it.id !== layer.id);
                    return newState;
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
