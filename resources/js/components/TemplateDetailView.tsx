import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface TemplateDetailViewProps {
    name: string;
    description: string;
}

const TemplateDetailView: React.FC<TemplateDetailViewProps> = ({ name, description }) => {
    return (
        <section aria-labelledby="template-details-heading">
            <Card>
                <CardHeader>
                    <CardTitle>Informasi Template</CardTitle>
                    <CardDescription>Detail nama dan deskripsi template kurikulum.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Nama Template</Label>
                        <p className="font-semibold">{name}</p>
                    </div>
                    <div className="space-y-2">
                        <Label>Deskripsi</Label>
                        <p className="text-gray-700">{description}</p>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
};

export default TemplateDetailView;
