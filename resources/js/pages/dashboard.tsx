import AppLayout from '@/layouts/app-layout';
import GuruDashboard from '@/pages/GuruDashboard';
import KepsekDashboard from '@/pages/KepsekDashboard';
import OperatorDashboard from '@/pages/OperatorDashboard';
import SiswaDashboard from '@/pages/SiswaDashboard';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
];

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;

    const renderDashboardByRole = () => {
        switch (auth.user.role) {
            case 'operator':
                return <OperatorDashboard />;
            case 'kepsek':
                return <KepsekDashboard />;
            case 'guru':
                return <GuruDashboard />;
            case 'siswa':
            default:
                return <SiswaDashboard />;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            {renderDashboardByRole()}
        </AppLayout>
    );
}
