import AdminLayout from '@/layouts/admin-layout';
import { type AssessmentAspect, type CurriculumTemplate, type SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Show() {
    const { curriculumTemplate } = usePage<SharedData<{
        curriculumTemplate: CurriculumTemplate & {
            assessment_aspects: AssessmentAspect[];
        };
    }>>().props;

    const { data, setData, post, errors, reset } = useForm({
        name: '',
        parent_id: '',
        input_type: 'range',
    });

    const [showAddAspectForm, setShowAddAspectForm] = useState(false);

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('curriculum-templates.assessment-aspects.store', curriculumTemplate.id), {
            onSuccess: () => {
                reset();
                setShowAddAspectForm(false);
            },
        });
    }

    return (
        <AdminLayout>
            <Head title={curriculumTemplate.name} />

            <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-semibold">{curriculumTemplate.name}</h1>
                <button onClick={() => setShowAddAspectForm(!showAddAspectForm)} className="btn btn-primary">
                    {showAddAspectForm ? 'Cancel' : 'Add Assessment Aspect'}
                </button>
            </div>

            {showAddAspectForm && (
                <div className="bg-white p-6 shadow-sm sm:rounded-lg mb-6">
                    <h2 className="text-xl font-semibold mb-4">Add New Assessment Aspect</h2>
                    <form onSubmit={submit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="parent_id" className="block text-sm font-medium text-gray-700">
                                Parent Aspect (Optional)
                            </label>
                            <select
                                name="parent_id"
                                id="parent_id"
                                className="mt-1 block w-full"
                                value={data.parent_id}
                                onChange={(e) => setData('parent_id', e.target.value)}
                            >
                                <option value="">No Parent</option>
                                {curriculumTemplate.assessment_aspects.map((aspect) => (
                                    <option key={aspect.id} value={aspect.id}>
                                        {aspect.name}
                                    </option>
                                ))}
                            </select>
                            {errors.parent_id && <div className="text-red-500 text-xs mt-1">{errors.parent_id}</div>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="input_type" className="block text-sm font-medium text-gray-700">
                                Input Type
                            </label>
                            <select
                                name="input_type"
                                id="input_type"
                                className="mt-1 block w-full"
                                value={data.input_type}
                                onChange={(e) => setData('input_type', e.target.value)}
                            >
                                <option value="range">Range</option>
                                <option value="select">Select</option>
                                <option value="text">Text</option>
                            </select>
                            {errors.input_type && <div className="text-red-500 text-xs mt-1">{errors.input_type}</div>}
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Add Aspect
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900">
                    <h2 className="text-xl font-semibold mb-4">Assessment Aspects</h2>
                    {curriculumTemplate.assessment_aspects.length === 0 ? (
                        <p>No assessment aspects defined yet.</p>
                    ) : (
                        <ul>
                            {curriculumTemplate.assessment_aspects.map((aspect) => (
                                <li key={aspect.id} className="mb-2">
                                    {aspect.name} ({aspect.input_type})
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
