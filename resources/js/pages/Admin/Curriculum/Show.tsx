import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { CurriculumTemplate, CurriculumAspect } from '@/types/curriculum';
import AspekModal from './AspekModal';
import TemplateHeader from '@/components/TemplateHeader';
import TemplateDetailView from '@/components/TemplateDetailView';
import AspectManager from '@/components/AspectManager';

interface Props {
    curriculumTemplate: CurriculumTemplate;
    aspects: CurriculumAspect[];
}

export default function ShowCurriculumTemplate({ curriculumTemplate, aspects }: Props) {
    const urlParams = new URLSearchParams(window.location.search);
    const initialViewMode = urlParams.get('viewMode') === 'aspects' ? 'aspects' : 'details';
    const [viewMode, setViewMode] = useState<'details' | 'aspects'>(initialViewMode);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAspect, setEditingAspect] = useState<CurriculumAspect | null>(null);

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
            href: route('admin.curriculum.show', { curriculum_template: curriculumTemplate.id, viewMode: viewMode }),
        },
    ];

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
    
    const handleViewModeChange = (mode: 'details' | 'aspects') => {
        setViewMode(mode);
        router.get(route('admin.curriculum.show', { curriculum_template: curriculumTemplate.id, viewMode: mode }), {}, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={curriculumTemplate.name} />

            <main className="container mx-auto py-6">
                <TemplateHeader
                    templateName={curriculumTemplate.name}
                    description="Kelola detail dan aspek pembelajaran untuk template ini."
                    viewMode={viewMode}
                    onViewModeChange={handleViewModeChange}
                />

                {viewMode === 'details' ? (
                    <TemplateDetailView
                        name={curriculumTemplate.name}
                        description={curriculumTemplate.description || 'Tidak ada deskripsi.'}
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
