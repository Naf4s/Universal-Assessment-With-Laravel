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
        title: 'Kelas Saya',
        href: route('guru.my-classes'),
    },
];

export default function GuruMyClassesIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelas Saya" />
            <Card>
                <CardHeader>
                    <CardTitle>Kelas Saya</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Halaman kelas untuk guru. Fitur ini akan dikembangkan lebih lanjut.</p>
                </CardContent>
            </Card>
        </AppLayout>
    );
} 