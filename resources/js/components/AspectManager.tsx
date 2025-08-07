import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';
import { CurriculumAspect } from '@/types/curriculum';

interface AspectManagerProps {
    aspects: CurriculumAspect[];
    handleCreateAspect: () => void;
    handleEditAspect: (aspect: CurriculumAspect) => void;
    handleDeleteAspect: (aspectId: number) => void;
}

const AspectManager: React.FC<AspectManagerProps> = ({
    aspects,
    handleCreateAspect,
    handleEditAspect,
    handleDeleteAspect,
}) => {
    return (
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
    );
};

export default AspectManager;
