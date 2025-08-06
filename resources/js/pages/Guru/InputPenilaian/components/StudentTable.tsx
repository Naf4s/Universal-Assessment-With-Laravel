import React from 'react';
import InputFieldRenderer from './InputFieldRenderer';
import NoteTextarea from './NoteTextarea';
import { AssessmentAspect, Student, GradeData } from '../types';

interface StudentTableProps {
  students: Student[];
  aspects: AssessmentAspect[];
  grades: GradeData[];
  onGradeChange: (studentId: number, aspectId: number, field: 'grade_value' | 'notes', value: string) => void;
}

export default function StudentTable({
  students,
  aspects,
  grades,
  onGradeChange,
}: StudentTableProps) {
  const getInputTypeLabel = (inputType: string) => {
    switch (inputType) {
      case 'angka': return 'Angka (0-100)';
      case 'huruf': return 'Huruf (A-E)';
      case 'biner': return 'Ya/Tidak';
      case 'teks': return 'Teks';
      default: return inputType;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-200 px-4 py-2 text-left">No</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Nama Siswa</th>
            {aspects.map((aspect) => (
              <th key={aspect.id} className="border border-gray-200 px-4 py-2 text-center">
                <div>
                  <div className="font-medium">{aspect.name}</div>
                  <div className="text-xs text-gray-500">
                    {getInputTypeLabel(aspect.input_type)}
                  </div>
                </div>
              </th>
            ))}
            <th className="border border-gray-200 px-4 py-2 text-center">Catatan</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.id} className="hover:bg-gray-50">
              <td className="border border-gray-200 px-4 py-2">{index + 1}</td>
              <td className="border border-gray-200 px-4 py-2 font-medium">
                {student.name}
              </td>
              {aspects.map((aspect) => {
                const grade = grades.find(
                  g => g.student_id === student.id && g.assessment_aspect_id === aspect.id
                );
                return (
                  <td key={aspect.id} className="border border-gray-200 px-4 py-2 text-center">
                    <InputFieldRenderer
                      aspect={aspect}
                      studentId={student.id}
                      aspectId={aspect.id}
                      currentValue={grade?.grade_value || ''}
                      onValueChange={onGradeChange}
                    />
                  </td>
                );
              })}
              <td className="border border-gray-200 px-4 py-2">
                <NoteTextarea
                  studentId={student.id}
                  aspectId={aspects[0]?.id || 0}
                  currentValue={
                    grades.find(
                      g => g.student_id === student.id && g.assessment_aspect_id === aspects[0]?.id
                    )?.notes || ''
                  }
                  onValueChange={onGradeChange}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 