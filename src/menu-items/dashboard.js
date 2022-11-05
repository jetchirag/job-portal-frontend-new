// assets
import { IconDashboard, IconForms  } from '@tabler/icons';

// constant
const icons = { IconDashboard, IconForms };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    children: [
        {
            id: 'default',
            title: 'Dashboard',
            type: 'item',
            url: '/dashboard/default',
            icon: icons.IconDashboard,
            breadcrumbs: false
        },
        {
            id: 'applications',
            title: 'Applications',
            type: 'item',
            url: '/dashboard/applications',
            icon: icons.IconForms,
            breadcrumbs: false
        }
    ]
};

export default dashboard;
