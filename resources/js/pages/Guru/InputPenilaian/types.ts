export interface AssessmentAspect {
  id: number;
  name: string;
  input_type: 'angka' | 'huruf' | 'biner' | 'teks';
  order: number;
  curriculum_template: {
    id: number;
    name: string;
  };
}

export interface Student {
  id: number;
  name: string;
  email: string;
}

export interface Teacher {
  id: number;
  name: string;
  email: string;
}

export interface GradeData {
  assessment_aspect_id: number;
  student_id: number;
  grade_value: string;
  notes?: string;
} 