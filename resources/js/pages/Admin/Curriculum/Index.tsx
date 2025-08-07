import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, Settings } from 'lucide-react';
import AspekModal from './AspekModal';
import { CurriculumTemplate, CurriculumAspect } from '@/types/curriculum';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
    {
        title: 'Manajemen Kurikulum',
        href: route('admin.curriculum.index'),
    },
];

interface Props {
    templates: CurriculumTemplate[];
    aspects: CurriculumAspect[];
}

export default function KurikulumIndex({ templates, aspects }: Props) {
    const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAspect, setEditingAspect] = useState<CurriculumAspect | null>(null);

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
            router.delete(`/admin/curriculum/aspects/${aspectId}`);
        }
    };

    const handleModalSubmit = (data: any) => {
        if (editingAspect) {
            router.put(`/admin/curriculum/aspects/${editingAspect.id}`, data);
        } else {
            router.post('/admin/curriculum/aspects', data);
        }
        setIsModalOpen(false);
        setEditingAspect(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Kurikulum" />
            
            <main className="container mx-auto py-6">
                <header className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manajemen Kurikulum</h1>
                        <p className="text-gray-600 mt-2">
                            Kelola template kurikulum dan struktur aspek pembelajaran
                        </p>
                    </div>
                    <nav className="flex gap-2">
                        <Button
                            variant={viewMode === 'list' ? 'default' : 'outline'}
                            onClick={() => setViewMode('list')}
                        >
                            Daftar Template
                        </Button>
                        <Button
                            variant={viewMode === 'editor' ? 'default' : 'outline'}
                            onClick={() => setViewMode('editor')}
                        >
                            Editor Struktur
                        </Button>
                    </nav>
                </header>

                {viewMode === 'list' ? (
                    <section aria-labelledby="template-list-heading">
                        <h2 id="template-list-heading" className="sr-only">Daftar Template Kurikulum</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {templates.map((template) => (
                                <Card key={template.id} className="hover:shadow-lg transition-shadow flex flex-col">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">{template.name}</CardTitle>
                                                <CardDescription className="mt-2">
                                                    {template.description}
                                                </CardDescription>
                                            </div>
                                            <Badge variant={template.is_active ? 'default' : 'secondary'}>
                                                {template.is_active ? 'Aktif' : 'Nonaktif'}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-grow space-y-3">
                                        <p className="flex items-center justify-between text-sm text-gray-600">
                                            <span>Jumlah Aspek:</span>
                                            <span className="font-medium">{template.aspects_count || 0}</span>
                                        </p>
                                        <p className="flex items-center justify-between text-sm text-gray-600">
                                            <span>Dibuat:</span>
                                            <span className="font-medium">
                                                {new Date(template.created_at).toLocaleDateString('id-ID')}
                                            </span>
                                        </p>
                                    </CardContent>
                                    <div className="flex gap-2 p-6 pt-3">
                                        <Link href={route('admin.curriculum.show', { curriculum_template: template.id, viewMode: 'details' })} className="flex-1">
                                            <Button size="sm" variant="outline" className="w-full">
                                                <Eye className="w-4 h-4 mr-2" />
                                                Lihat
                                            </Button>
                                        </Link>
                                        <Link href={route('admin.curriculum.edit', { curriculum_template: template.id, viewMode: 'details' })} className="flex-1">
                                            <Button size="sm" variant="outline" className="w-full">
                                                <Edit className="w-4 h-4 mr-2" />
                                                Edit
                                            </Button>
                                        </Link>
                                        <Link href={route('admin.curriculum.show', { curriculum_template: template.id, viewMode: 'aspects' })} className="flex-1">
                                            <Button size="sm" variant="outline" className="w-full">
                                                <Settings className="w-4 h-4 mr-2" />
                                                Atur
                                            </Button>
                                        </Link>
                                    </div>
                                </Card>
                            ))}
                            
                            <Link href={route('admin.curriculum.create')}>
                                <Card className="border-dashed border-2 border-gray-300 hover:border-primary transition-colors h-full">
                                    <CardContent className="flex flex-col items-center justify-center h-full py-12">
                                        <Plus className="w-12 h-12 text-gray-400 mb-4" />
                                        <h3 className="text-lg font-medium text-gray-600 mb-2">
                                            Tambah Template Baru
                                        </h3>
                                        <p className="text-sm text-gray-500 text-center">
                                            Buat template kurikulum baru untuk sekolah Anda
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    </section>
                ) : (
                    <section aria-labelledby="structure-editor-heading">
                        <header className="flex justify-between items-center mb-6">
                            <h2 id="structure-editor-heading" className="text-xl font-semibold">Struktur Aspek Kurikulum</h2>
                            <Button onClick={handleCreateAspect}>
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah Aspek
                            </Button>
                        </header>

                        <ul className="grid gap-4">
                            {aspects.map((aspect) => (
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
                            ))}
                            
                            {aspects.length === 0 && (
                                <li>
                                    <Card>
                                        <CardContent className="p-8 text-center">
                                            <div className="text-gray-500">
                                                <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                                <h3 className="text-lg font-medium mb-2">Belum ada aspek kurikulum</h3>
                                                <p className="text-sm mb-4">
                                                    Mulai dengan menambahkan aspek pertama untuk struktur kurikulum Anda
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
                aspects={aspects}
            />
        </AppLayout>
    );
}