import AdminLayout from '@/layouts/admin-layout';
import { type CurriculumTemplate, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index() {
    const { curriculumTemplates } = usePage<SharedData<{
        curriculumTemplates: CurriculumTemplate[];
    }>>().props;

    return (
        <AdminLayout>
            <Head title="Curriculum Templates" />

            <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-semibold">Curriculum Templates</h1>
                <Link href={route('curriculum-templates.create')} className="btn btn-primary">
                    Add Template
                </Link>
            </div>

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900">
                    <table className="table-auto w-full">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Description</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {curriculumTemplates.map((template) => (
                                <tr key={template.id}>
                                    <td className="border px-4 py-2">{template.name}</td>
                                    <td className="border px-4 py-2">{template.description}</td>
                                    <td className="border px-4 py-2">
                                        <Link href={route('curriculum-templates.edit', template.id)} className="text-blue-500 hover:text-blue-700">
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
