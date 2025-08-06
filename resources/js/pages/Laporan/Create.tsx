import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout'; // Assuming you have a standard layout
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Define types for better safety
interface Class {
    id: number;
    name: string;
}

interface Student {
    id: number;
    name: string;
}

interface PageProps {
    classes: Class[];
    // Add other props if they exist
}

const CreateReport = () => {
    const { classes } = usePage<PageProps>().props;

    const [academicYear, setAcademicYear] = useState<number>(new Date().getFullYear());
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<string>('');
    const [isLoadingStudents, setIsLoadingStudents] = useState<boolean>(false);

    useEffect(() => {
        if (selectedClass) {
            setIsLoadingStudents(true);
            // In a real app, you would fetch this from your backend
            // Example: axios.get(`/api/classes/${selectedClass}/students`).then(response => { ... })
            // For now, we'll use mock data.
            const mockStudents: Student[] = [
                { id: 1, name: 'Siswa A (Mock)' },
                { id: 2, name: 'Siswa B (Mock)' },
                { id: 3, name: 'Siswa C (Mock)' },
            ];
            setStudents(mockStudents);
            setSelectedStudent(''); // Reset student selection
            setIsLoadingStudents(false);
        } else {
            setStudents([]);
        }
    }, [selectedClass]);

    const handleGenerateReport = () => {
        if (selectedStudent && academicYear) {
            router.get(route('reports.show', { student: selectedStudent, year: academicYear }));
        } else {
            alert('Please select a student and academic year.');
        }
    };

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Cetak Rapor Siswa
                </h2>
            }
        >
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="space-y-6">
                                <div>
                                    <Label htmlFor="academicYear">Tahun Ajaran</Label>
                                    <Input
                                        id="academicYear"
                                        type="number"
                                        value={academicYear}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAcademicYear(parseInt(e.target.value, 10))}
                                        className="mt-1 block w-full"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="class">Kelas</Label>
                                    <Select onValueChange={setSelectedClass} value={selectedClass}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih kelas..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classes.map((c) => (
                                                <SelectItem key={c.id} value={String(c.id)}>
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="student">Siswa</Label>
                                    <Select 
                                        onValueChange={setSelectedStudent} 
                                        value={selectedStudent}
                                        disabled={!selectedClass || isLoadingStudents}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={isLoadingStudents ? 'Memuat siswa...' : 'Pilih siswa...'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {students.map((s) => (
                                                <SelectItem key={s.id} value={String(s.id)}>
                                                    {s.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleGenerateReport}
                                        disabled={!selectedStudent || !academicYear}
                                    >
                                        Buat Rapor
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default CreateReport;