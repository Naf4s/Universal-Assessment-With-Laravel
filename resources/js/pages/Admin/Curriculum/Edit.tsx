import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';

import { CurriculumTemplate, CurriculumAspect } from '@/types/curriculum';
import AspekModal from './AspekModal';
import TemplateDetailsForm from '@/components/TemplateDetailsForm';
import AspectManager from '@/components/AspectManager';

interface Props {
    curriculumTemplate: CurriculumTemplate;
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
        put(route('admin.curriculum.update', { curriculum_template: curriculumTemplate.id }));
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
                    <TemplateDetailsForm
                        data={data}
                        setData={setData}
                        onSubmit={handleTemplateUpdate}
                        processing={processing}
                        errors={errors}
                    />
                ) : (
                    <AspectManager
                        aspects={aspects}
                        handleCreateAspect={handleCreateAspect}
                        handleEditAspect={handleEditAspect}
                        handleDeleteAspect={handleDeleteAspect}
                    />
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
                aspects={aspects.filter(a => a.curriculum_template_id === curriculumTemplate.id)}
            />
        </AppLayout>
    );
}
