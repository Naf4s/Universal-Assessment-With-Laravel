import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
    {
        title: 'Manajemen Kurikulum',
        href: route('admin.curriculum.index'),
    },
    {
        title: 'Buat Template Baru',
        href: route('admin.curriculum.create'),
    },
];

export default function CreateCurriculumTemplate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('curriculum-templates.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Template Kurikulum" />

            <main className="container mx-auto py-6">
                <header className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Buat Template Kurikulum Baru</h1>
                    <p className="text-gray-600 mt-2">
                        Isi formulir di bawah ini untuk membuat template kurikulum baru.
                    </p>
                </header>
                
                <Card>
                    <form onSubmit={submit}>
                        <CardHeader>
                            <CardTitle>Detail Template</CardTitle>
                            <CardDescription>
                                Berikan nama dan deskripsi yang jelas untuk template ini.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Template</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    autoFocus
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                />
                                <InputError message={errors.description} />
                            </div>
                        </CardContent>
                        <div className="flex items-center justify-end gap-4 p-6 pt-0">
                            <Link href={route('admin.curriculum.index')} className="text-sm text-gray-600 hover:underline">
                                Batal
                            </Link>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Template'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </main>
        </AppLayout>
    );
}
