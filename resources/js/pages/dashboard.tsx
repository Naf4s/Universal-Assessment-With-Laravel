import AppLayout from '@/layouts/app-layout';
import AdminDashboard from '@/pages/AdminDashboard';
import GuruDashboard from '@/pages/GuruDashboard';
import KepsekDashboard from '@/pages/KepsekDashboard';
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
            case 'admin':
                return <AdminDashboard />;
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
