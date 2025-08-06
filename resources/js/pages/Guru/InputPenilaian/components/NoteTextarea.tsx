import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface NoteTextareaProps {
  studentId: number;
  aspectId: number;
  currentValue: string;
  onValueChange: (studentId: number, aspectId: number, field: 'grade_value' | 'notes', value: string) => void;
}

export default function NoteTextarea({
  studentId,
  aspectId,
  currentValue,
  onValueChange,
}: NoteTextareaProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onValueChange(studentId, aspectId, 'notes', e.target.value);
  };

  return (
    <Textarea
      placeholder="Catatan (opsional)"
      className="min-h-[60px]"
      value={currentValue}
      onChange={handleChange}
    />
  );
} 