import { faUser, faStore, faInfo, faHome, faChartBar, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { SideBarElement } from './side-bar.types';

const NavbarElements: SideBarElement[][] = [
    [{
        type: 'link',
        routerLink: '/dashboard',
        icon: faChartBar,
        label: 'Dashboard',
        accessRequired: [{
            role: 'admin',
            filter: '',
        }, {
            role: 'placeAdmin',
            filter: '',
        }],
    },
    {
        type: 'link',
        routerLink: '/store',
        icon: faStore,
        label: 'Tiendas',
        accessRequired: [{
            role: 'admin',
            filter: '',
        }, {
            role: 'placeAdmin',
            filter: '',
        }],
    },
    {
        type: 'link',
        routerLink: '/information',
        icon: faInfo,
        label: 'Información y Descuentos',
        accessRequired: [{
            role: 'admin',
            filter: '',
        }, {
            role: 'placeAdmin',
            filter: '',
        }],
    },
    {
        type: 'link',
        routerLink: '/qrlocation',
        icon: faQrcode,
        label: 'Códigos QR',
        accessRequired: [{
            role: 'admin',
            filter: '',
        }, {
            role: 'placeAdmin',
            filter: '',
        }],
    },
    ],
    [
        {
            type: 'link',
            routerLink: '/place',
            icon: faHome,
            label: 'Lugares',
            accessRequired: [{
                role: 'admin',
                filter: '',
            }],
        },
        {
            type: 'link',
            routerLink: '/user',
            icon: faUser,
            label: 'Usuarios',
            accessRequired: [{
                role: 'admin',
                filter: '',
            }],
        },
    ]
];

export const NAV_DATA: SideBarElement[][] = [...NavbarElements]