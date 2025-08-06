import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
    {
        title: 'Laporan',
        href: route('kepsek.reports'),
    },
];

export default function KepsekReportsIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan" />
            <Card>
                <CardHeader>
                    <CardTitle>Laporan</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Halaman laporan untuk kepala sekolah. Fitur ini akan dikembangkan lebih lanjut.</p>
                </CardContent>
            </Card>
        </AppLayout>
    );
} 