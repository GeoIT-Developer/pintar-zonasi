/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';
import { ROUTE } from '@/configs/route';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: 'Beranda',
            items: [{ label: 'Cek Zonasi', icon: 'pi pi-fw pi-bullseye', to: ROUTE.HOME.URL }],
        },
        {
            label: 'Data',
            items: [
                { label: 'Batas Wilayah', icon: 'pi pi-fw pi-map', to: ROUTE.DATA.BATAS_WILAYAH.URL },
                { label: 'Jalan', icon: 'pi pi-fw pi-wave-pulse', to: ROUTE.DATA.JALAN.URL },
                { label: 'Sekolah', icon: 'pi pi-fw pi-building-columns', to: ROUTE.DATA.SEKOLAH.URL },
                { label: 'Peserta Didik', icon: 'pi pi-fw pi-users', to: ROUTE.DATA.PESERTA_DIDIK.URL },
            ],
        },
        {
            label: 'Zonasi',
            items: [
                { label: 'Project Zonasi', icon: 'pi pi-fw pi-book', to: ROUTE.ZONASI.URL },
                ...['001', '002', '003', '004', '005', '006'].map((item) => {
                    return { label: `Project-${item}`, icon: 'pi pi-fw pi-server', to: `/project/${item}` };
                }),
            ],
        },
        {
            label: 'Home',
            items: [
                { label: 'App', icon: 'pi pi-fw pi-home', to: '/demo' },
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/demo/dashboard' },
            ],
        },
        {
            label: 'UI Components',
            items: [
                { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/demo/uikit/formlayout' },
                { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/demo/uikit/input' },
                { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', to: '/demo/uikit/floatlabel' },
                { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', to: '/demo/uikit/invalidstate' },
                { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/demo/uikit/button', class: 'rotated-icon' },
                { label: 'Table', icon: 'pi pi-fw pi-table', to: '/demo/uikit/table' },
                { label: 'List', icon: 'pi pi-fw pi-list', to: '/demo/uikit/list' },
                { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/demo/uikit/tree' },
                { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/demo/uikit/panel' },
                { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/demo/uikit/overlay' },
                { label: 'Media', icon: 'pi pi-fw pi-image', to: '/demo/uikit/media' },
                { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/demo/uikit/menu', preventExact: true },
                { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/demo/uikit/message' },
                { label: 'File', icon: 'pi pi-fw pi-file', to: '/demo/uikit/file' },
                { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/demo/uikit/charts' },
                { label: 'Misc', icon: 'pi pi-fw pi-circle', to: '/demo/uikit/misc' },
            ],
        },
        {
            label: 'Prime Blocks',
            items: [
                { label: 'Free Blocks', icon: 'pi pi-fw pi-eye', to: '/demo/blocks', badge: 'NEW' },
                {
                    label: 'All Blocks',
                    icon: 'pi pi-fw pi-globe',
                    url: 'https://blocks.primereact.org',
                    target: '_blank',
                },
            ],
        },
        {
            label: 'Utilities',
            items: [
                { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', to: '/demo/utilities/icons' },
                { label: 'PrimeFlex', icon: 'pi pi-fw pi-desktop', url: 'https://primeflex.org/', target: '_blank' },
            ],
        },
        {
            label: 'Pages',
            icon: 'pi pi-fw pi-briefcase',
            to: '/demo/pages',
            items: [
                {
                    label: 'Landing',
                    icon: 'pi pi-fw pi-globe',
                    to: '/demo/landing',
                },
                {
                    label: 'Auth',
                    icon: 'pi pi-fw pi-user',
                    items: [
                        {
                            label: 'Login',
                            icon: 'pi pi-fw pi-sign-in',
                            to: '/demo/auth/login',
                        },
                        {
                            label: 'Error',
                            icon: 'pi pi-fw pi-times-circle',
                            to: '/demo/auth/error',
                        },
                        {
                            label: 'Access Denied',
                            icon: 'pi pi-fw pi-lock',
                            to: '/demo/auth/access',
                        },
                    ],
                },
                {
                    label: 'Crud',
                    icon: 'pi pi-fw pi-pencil',
                    to: '/demo/pages/crud',
                },
                {
                    label: 'Timeline',
                    icon: 'pi pi-fw pi-calendar',
                    to: '/demo/pages/timeline',
                },
                {
                    label: 'Not Found',
                    icon: 'pi pi-fw pi-exclamation-circle',
                    to: '/demo/pages/notfound',
                },
                {
                    label: 'Empty',
                    icon: 'pi pi-fw pi-circle-off',
                    to: '/demo/pages/empty',
                },
            ],
        },
        {
            label: 'Hierarchy',
            items: [
                {
                    label: 'Submenu 1',
                    icon: 'pi pi-fw pi-bookmark',
                    items: [
                        {
                            label: 'Submenu 1.1',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [
                                { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
                            ],
                        },
                        {
                            label: 'Submenu 1.2',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }],
                        },
                    ],
                },
                {
                    label: 'Submenu 2',
                    icon: 'pi pi-fw pi-bookmark',
                    items: [
                        {
                            label: 'Submenu 2.1',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [
                                { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' },
                            ],
                        },
                        {
                            label: 'Submenu 2.2',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }],
                        },
                    ],
                },
            ],
        },
        {
            label: 'Get Started',
            items: [
                {
                    label: 'Documentation',
                    icon: 'pi pi-fw pi-question',
                    to: '/demo/documentation',
                },
                {
                    label: 'Figma',
                    url: 'https://www.dropbox.com/scl/fi/bhfwymnk8wu0g5530ceas/sakai-2023.fig?rlkey=u0c8n6xgn44db9t4zkd1brr3l&dl=0',
                    icon: 'pi pi-fw pi-pencil',
                    target: '_blank',
                },
                {
                    label: 'View Source',
                    icon: 'pi pi-fw pi-search',
                    url: 'https://github.com/primefaces/sakai-react',
                    target: '_blank',
                },
            ],
        },
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? (
                        <AppMenuitem item={item} root={true} index={i} key={item.label} />
                    ) : (
                        <li className="menu-separator"></li>
                    );
                })}

                <Link href="https://blocks.primereact.org" target="_blank" style={{ cursor: 'pointer' }}>
                    <img
                        alt="Prime Blocks"
                        className="w-full mt-3"
                        src={`/layout/images/banner-primeblocks${
                            layoutConfig.colorScheme === 'light' ? '' : '-dark'
                        }.png`}
                    />
                </Link>
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
