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
        title: 'Manajemen Pengguna',
        href: route('users.index'),
    },
];

export default function AdminUsersIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Pengguna" />
            <Card>
                <CardHeader>
                    <CardTitle>Manajemen Pengguna</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Halaman manajemen pengguna untuk admin. Fitur ini akan dikembangkan lebih lanjut.</p>
                </CardContent>
            </Card>
        </AppLayout>
    );
} 