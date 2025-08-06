import React from 'react';

// --- TYPE DEFINITIONS ---
interface Student {
    id: number;
    name: string;
    class?: string; // class is optional
}

interface Grade {
    score: number;
}

interface AssessmentAspect {
    id: number;
    aspect_name: string;
    grade?: Grade;
    children?: AssessmentAspect[];
}

interface Subject extends AssessmentAspect {
    subject_name: string;
}

interface ReportCard {
    subjects: Subject[];
}

interface SummaryStatistics {
    total_grades_filled: number;
    total_grades_empty: number;
    completeness_percentage: number;
}

interface ReportData {
    student: Student;
    academic_year: string | number;
    report_card: ReportCard;
    summary_statistics: SummaryStatistics;
}

// --- COMPONENT PROPS ---
interface AspectRendererProps {
    aspect: AssessmentAspect;
}

interface RaporTemplateProps {
    reportData?: ReportData;
}

// --- COMPONENTS ---

// This component will render the individual assessment aspects recursively.
const AspectRenderer: React.FC<AspectRendererProps> = ({ aspect }) => (
    <div className="ml-4 border-l pl-4 my-2">
        <p className="font-semibold">{aspect.aspect_name}</p>
        {aspect.grade && (
            <p className="text-sm">
                Nilai: <span className="font-bold">{aspect.grade.score}</span>
            </p>
        )}
        {aspect.children && aspect.children.map(child => (
            <AspectRenderer key={child.id} aspect={child} />
        ))}
    </div>
);

const RaporTemplate: React.FC<RaporTemplateProps> = ({ reportData }) => {
    if (!reportData) {
        return <div className="p-8 text-center">Data rapor tidak tersedia.</div>;
    }

    const { student, academic_year, report_card, summary_statistics } = reportData;

    return (
        <div className="bg-white shadow-lg my-8 mx-auto rapor-sheet">
            <div className="p-12">
                {/* Header */}
                <header className="text-center border-b-2 pb-4 mb-8">
                    <h1 className="text-3xl font-bold">Laporan Hasil Belajar</h1>
                    <h2 className="text-xl">Tahun Ajaran {academic_year}</h2>
                </header>

                {/* Student Information */}
                <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 border-b pb-2">Data Siswa</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p><strong>Nama:</strong> {student.name}</p>
                            <p><strong>NIS/NISN:</strong> {student.id}</p> 
                        </div>
                        <div>
                            <p><strong>Kelas:</strong> {student.class || 'N/A'}</p>
                        </div>
                    </div>
                </section>

                {/* Grades */}
                <section>
                    <h3 className="text-xl font-semibold mb-4 border-b pb-2">Rincian Nilai</h3>
                    {report_card.subjects.map(subject => (
                        <div key={subject.id} className="mb-6 p-4 border rounded-lg break-inside-avoid">
                            <h4 className="text-lg font-bold bg-gray-100 p-2 rounded-t-lg">{subject.subject_name}</h4>
                            {subject.children && subject.children.map(scope => (
                                <div key={scope.id} className="mt-2 pl-4">
                                     <h5 className="font-semibold text-md">{scope.aspect_name}</h5>
                                    {scope.children && scope.children.map(objective => (
                                        <AspectRenderer key={objective.id} aspect={objective} />
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </section>

                {/* Summary */}
                <section className="mt-8 pt-4 border-t break-before-page">
                     <h3 className="text-xl font-semibold mb-4 border-b pb-2">Ringkasan & Catatan</h3>
                     <p><strong>Total Nilai Diisi:</strong> {summary_statistics.total_grades_filled}</p>
                     <p><strong>Total Nilai Kosong:</strong> {summary_statistics.total_grades_empty}</p>
                     <p><strong>Persentase Kelengkapan:</strong> {summary_statistics.completeness_percentage.toFixed(2)}%</p>
                     <div className="mt-4">
                        <p><strong>Catatan Wali Kelas:</strong></p>
                        <div className="h-24 border rounded p-2 mt-1"></div>
                     </div>
                </section>

                {/* Footer with signatures */}
                <footer className="mt-16 pt-8">
                    <div className="grid grid-cols-3 gap-8 text-center">
                        <div>
                            <p className="mb-16">Orang Tua/Wali</p>
                            <p>(___________________)</p>
                        </div>
                        <div>
                            <p className="mb-16">Wali Kelas</p>
                            <p>(___________________)</p>
                        </div>
                        <div>
                            <p className="mb-16">Kepala Sekolah</p>
                            <p>(___________________)</p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default RaporTemplate;
