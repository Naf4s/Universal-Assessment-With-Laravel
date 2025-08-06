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
        title: 'Nilai Saya',
        href: route('siswa.my-grades'),
    },
];

export default function SiswaMyGradesIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nilai Saya" />
            <Card>
                <CardHeader>
                    <CardTitle>Nilai Saya</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Halaman nilai untuk siswa. Fitur ini akan dikembangkan lebih lanjut.</p>
                </CardContent>
            </Card>
        </AppLayout>
    );
} 