import AdminLayout from '@/layouts/admin-layout';
import { useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, errors } = useForm({
        name: '',
        description: '',
    });

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('curriculum-templates.store'));
    }

    return (
        <AdminLayout>
            <h1 className="text-2xl font-semibold mb-6">Create Curriculum Template</h1>

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
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        rows={4}
                        className="mt-1 block w-full"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                    />
                    {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
                </div>

                <button type="submit" className="btn btn-primary">
                    Create
                </button>
            </form>
        </AdminLayout>
    );
}
