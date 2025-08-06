import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

import { CurriculumTemplate, CurriculumAspect } from '@/types/curriculum';
import AspekModal from './AspekModal';

import { Plus, Edit, Trash2, Settings } from 'lucide-react';

interface Props {
    curriculumTemplate: CurriculumTemplate;
    // aspects prop di sini akan berisi hanya aspek yang terkait dengan template ini
    aspects: CurriculumAspect[];
}

export default function EditCurriculumTemplate({ curriculumTemplate, aspects }: Props) {
    const [viewMode, setViewMode] = useState<'details' | 'aspects'>('details');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAspect, setEditingAspect] = useState<CurriculumAspect | null>(null);

    const { data, setData, put, processing, errors } = useForm({
        name: curriculumTemplate.name,
        description: curriculumTemplate.description || '',
    });

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
            title: curriculumTemplate.name,
            href: route('admin.curriculum.show', { curriculum_template: curriculumTemplate.id }),
        },
    ];

    const handleTemplateUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('curriculum-templates.update', { curriculum_template: curriculumTemplate.id }));
    };

    const handleCreateAspect = () => {
        setEditingAspect(null);
        setIsModalOpen(true);
    };

    const handleEditAspect = (aspect: CurriculumAspect) => {
        setEditingAspect(aspect);
        setIsModalOpen(true);
    };

    const handleDeleteAspect = (aspectId: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus aspek ini?')) {
            router.delete(route('admin.curriculum.aspects.destroy', { aspect: aspectId }), {
                onSuccess: () => router.reload({ preserveScroll: true }),
            });
        }
    };

    const handleModalSubmit = (formData: any) => {
        // Tambahkan curriculum_template_id saat membuat atau mengedit aspek
        const dataWithTemplateId = {
            ...formData,
            curriculum_template_id: curriculumTemplate.id,
        };

        if (editingAspect) {
            router.put(route('admin.curriculum.aspects.update', { aspect: editingAspect.id }), dataWithTemplateId, {
                onSuccess: () => router.reload({ preserveScroll: true }),
            });
        } else {
            router.post(route('admin.curriculum.aspects.store'), dataWithTemplateId, {
                onSuccess: () => router.reload({ preserveScroll: true }),
            });
        }
        setIsModalOpen(false);
        setEditingAspect(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={curriculumTemplate.name} />

            <main className="container mx-auto py-6">
                <header className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{curriculumTemplate.name}</h1>
                        <p className="text-gray-600 mt-2">
                            Kelola detail dan aspek pembelajaran untuk template ini.
                        </p>
                    </div>
                    <nav className="flex gap-2">
                        <Button
                            variant={viewMode === 'details' ? 'default' : 'outline'}
                            onClick={() => setViewMode('details')}
                        >
                            Detail Template
                        </Button>
                        <Button
                            variant={viewMode === 'aspects' ? 'default' : 'outline'}
                            onClick={() => setViewMode('aspects')}
                        >
                            Atur Aspek
                        </Button>
                    </nav>
                </header>

                {viewMode === 'details' ? (
                    <section aria-labelledby="template-details-heading">
                        <Card>
                            <form onSubmit={handleTemplateUpdate}>
                                <CardHeader>
                                    <CardTitle>Informasi Template</CardTitle>
                                    <CardDescription>Perbarui nama dan deskripsi template kurikulum.</CardDescription>
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
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </section>
                ) : (
                    <section aria-labelledby="aspect-structure-heading">
                        <header className="flex justify-between items-center mb-6">
                            <h2 id="aspect-structure-heading" className="text-xl font-semibold">Struktur Aspek Pembelajaran</h2>
                            <Button onClick={handleCreateAspect}>
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah Aspek
                            </Button>
                        </header>

                        <ul className="grid gap-4">
                            {aspects.length > 0 ? (
                                aspects.map((aspect) => (
                                    <li key={aspect.id}>
                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                        <div>
                                                            <h3 className="font-medium">{aspect.name}</h3>
                                                            <p className="text-sm text-gray-600">
                                                                Tipe: {aspect.input_type} |
                                                                Parent: {aspect.parent_id ? `ID ${aspect.parent_id}` : 'Root'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleEditAspect(aspect)}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleDeleteAspect(aspect.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </li>
                                ))
                            ) : (
                                <li>
                                    <Card>
                                        <CardContent className="p-8 text-center">
                                            <div className="text-gray-500">
                                                <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                                <h3 className="text-lg font-medium mb-2">Belum ada aspek pembelajaran</h3>
                                                <p className="text-sm mb-4">
                                                    Mulai dengan menambahkan aspek pertama untuk template ini.
                                                </p>
                                                <Button onClick={handleCreateAspect}>
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Tambah Aspek Pertama
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </li>
                            )}
                        </ul>
                    </section>
                )}
            </main>

            <AspekModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingAspect(null);
                }}
                onSubmit={handleModalSubmit}
                aspect={editingAspect}
                // Filter aspek yang dapat dipilih sebagai parent agar hanya dari template yang sama
                aspects={aspects.filter(a => a.curriculum_template_id === curriculumTemplate.id)}
            />
        </AppLayout>
    );
}
