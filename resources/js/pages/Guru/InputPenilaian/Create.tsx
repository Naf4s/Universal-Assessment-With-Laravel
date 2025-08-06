import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import FilterPanel from './components/FilterPanel';
import StudentTable from './components/StudentTable';
import GradeFormFooter from './components/GradeFormFooter';
import { AssessmentAspect, Student, Teacher, GradeData } from './types';

interface Props {
  assessmentAspects: Record<number, AssessmentAspect[]>;
  students: Student[];
  teacher: Teacher;
}

export default function InputPenilaian({ assessmentAspects, students, teacher }: Props) {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedAspect, setSelectedAspect] = useState<string>('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [filteredAspects, setFilteredAspects] = useState<AssessmentAspect[]>([]);

  const { data, setData, post, processing, errors, reset } = useForm({
    grades: [] as any[],
  });

  // Filter aspects when subject is selected
  useEffect(() => {
    if (selectedSubject) {
      const aspect = assessmentAspects[parseInt(selectedClass)]?.find(a => a.id.toString() === selectedSubject);
      if (aspect) {
        setFilteredAspects([aspect]);
      }
    } else {
      setFilteredAspects([]);
    }
  }, [selectedSubject, selectedClass, assessmentAspects]);

  // Filter students when class is selected (for now, show all students)
  useEffect(() => {
    if (selectedClass) {
      setFilteredStudents(students);
    } else {
      setFilteredStudents([]);
    }
  }, [selectedClass, students]);

  // Initialize grades when aspects and students are available
  useEffect(() => {
    if (filteredAspects.length > 0 && filteredStudents.length > 0) {
      const newGrades: GradeData[] = [];
      
      filteredAspects.forEach(aspect => {
        filteredStudents.forEach(student => {
          newGrades.push({
            assessment_aspect_id: aspect.id,
            student_id: student.id,
            grade_value: '',
            notes: '',
          });
        });
      });
      
      setData('grades', newGrades);
    }
  }, [filteredAspects, filteredStudents]);

  const handleGradeChange = (studentId: number, aspectId: number, field: 'grade_value' | 'notes', value: string) => {
    const currentGrades = data.grades as GradeData[];
    const updatedGrades = currentGrades.map(grade => {
      if (grade.student_id === studentId && grade.assessment_aspect_id === aspectId) {
        return { ...grade, [field]: value };
      }
      return grade;
    });
    setData('grades', updatedGrades);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty grades
    const currentGrades = data.grades as GradeData[];
    const nonEmptyGrades = currentGrades.filter(grade => grade.grade_value.trim() !== '');
    
    if (nonEmptyGrades.length === 0) {
      alert('Silakan input minimal satu nilai sebelum menyimpan.');
      return;
    }

    post(route('penilaian.store'), { grades: nonEmptyGrades });
  };

  const handleReset = () => {
    setSelectedClass('');
    setSelectedSubject('');
    setSelectedAspect('');
    reset();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Input Penilaian</h1>
          <p className="text-muted-foreground">
            Guru: {teacher.name} | {teacher.email}
          </p>
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        assessmentAspects={assessmentAspects}
        selectedClass={selectedClass}
        selectedSubject={selectedSubject}
        selectedAspect={selectedAspect}
        filteredAspects={filteredAspects}
        onClassChange={setSelectedClass}
        onSubjectChange={setSelectedSubject}
        onAspectChange={setSelectedAspect}
      />

      {/* Students and Grades Table */}
      {filteredStudents.length > 0 && filteredAspects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Input Nilai Siswa</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <StudentTable
                students={filteredStudents}
                aspects={filteredAspects}
                grades={data.grades as GradeData[]}
                onGradeChange={handleGradeChange}
              />
              
              <GradeFormFooter
                processing={processing}
                onReset={handleReset}
              />
            </form>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {Object.values(errors).map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
} 