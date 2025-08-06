import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CurriculumAspect } from '@/types/curriculum';

interface AspekModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    aspect: CurriculumAspect | null;
    aspects: CurriculumAspect[];
}

export default function AspekModal({ isOpen, onClose, onSubmit, aspect, aspects }: AspekModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        parent_id: '',
        input_type: 'teks'
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (aspect) {
            setFormData({
                name: aspect.name,
                parent_id: aspect.parent_id?.toString() || '',
                input_type: aspect.input_type
            });
        } else {
            setFormData({
                name: '',
                parent_id: '',
                input_type: 'teks'
            });
        }
        setErrors({});
    }, [aspect, isOpen]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Nama aspek harus diisi';
        }

        if (formData.name.trim().length < 3) {
            newErrors.name = 'Nama aspek minimal 3 karakter';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const submitData = {
            ...formData,
            parent_id: formData.parent_id ? parseInt(formData.parent_id) : null
        };

        onSubmit(submitData);
    };

    const inputTypeOptions = [
        { value: 'angka', label: 'Angka' },
        { value: 'huruf', label: 'Huruf' },
        { value: 'biner', label: 'Biner' },
        { value: 'teks', label: 'Teks' }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {aspect ? 'Edit Aspek Kurikulum' : 'Tambah Aspek Kurikulum'}
                    </DialogTitle>
                    <DialogDescription>
                        {aspect 
                            ? 'Ubah informasi aspek kurikulum yang sudah ada'
                            : 'Tambahkan aspek baru ke dalam struktur kurikulum'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Aspek *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Contoh: Pengetahuan, Keterampilan, Sikap"
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="parent_id">Aspek Induk</Label>
                        <Select
                            value={formData.parent_id}
                            onValueChange={(value) => handleInputChange('parent_id', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih aspek induk (opsional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Tidak ada induk (Root)</SelectItem>
                                {aspects
                                    .filter(a => a.id !== aspect?.id) // Exclude current aspect when editing
                                    .map((parentAspect) => (
                                        <SelectItem key={parentAspect.id} value={parentAspect.id.toString()}>
                                            {parentAspect.name}
                                        </SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                            Kosongkan jika ini adalah aspek tingkat teratas
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="input_type">Tipe Input *</Label>
                        <Select
                            value={formData.input_type}
                            onValueChange={(value) => handleInputChange('input_type', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {inputTypeOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                            Tentukan jenis input yang akan digunakan untuk aspek ini
                        </p>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Batal
                        </Button>
                        <Button type="submit">
                            {aspect ? 'Update Aspek' : 'Tambah Aspek'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
} 