import React from 'react';
import AppLayout from '@/layouts/app-layout';
import RaporTemplate from '@/Components/RaporTemplate';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

// Define the types for the report data structure
interface Grade {
    score: number;
}

interface Aspect {
    id: number;
    aspect_name: string;
    grade?: Grade;
    children?: Aspect[];
}

interface Subject {
    id: number;
    subject_name: string;
    children: Aspect[];
}

interface ReportCard {
    subjects: Subject[];
}

interface Student {
    id: number;
    name: string;
    class?: string;
}

interface SummaryStatistics {
    total_grades_filled: number;
    total_grades_empty: number;
    completeness_percentage: number;
}

interface ReportData {
    student: Student;
    academic_year: string;
    report_card: ReportCard;
    summary_statistics: SummaryStatistics;
}

interface ShowReportProps {
    reportData: ReportData;
}

export default function ShowReport({ reportData }: ShowReportProps) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <AppLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Rapor Siswa
                    </h2>
                    <Button onClick={handlePrint} className="no-print">
                        <Printer className="mr-2 h-4 w-4" /> Cetak Rapor
                    </Button>
                </div>
            }
        >
            <div id="rapor-container">
                <RaporTemplate reportData={reportData} />
            </div>
        </AppLayout>
    );
}
