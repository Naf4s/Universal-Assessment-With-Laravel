import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { useForm } from '@inertiajs/react';

interface TemplateDetailsFormProps {
    data: {
        name: string;
        description: string;
    };
    setData: (key: 'name' | 'description', value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    processing: boolean;
    errors: Partial<Record<'name' | 'description', string>>;
}

const TemplateDetailsForm: React.FC<TemplateDetailsFormProps> = ({
    data,
    setData,
    onSubmit,
    processing,
    errors,
}) => {
    return (
        <section aria-labelledby="template-details-heading">
            <Card>
                <form onSubmit={onSubmit}>
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
    );
};

export default TemplateDetailsForm;
