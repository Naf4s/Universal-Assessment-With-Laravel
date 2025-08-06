import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AssessmentAspect } from '../types';

interface InputFieldRendererProps {
  aspect: AssessmentAspect;
  studentId: number;
  aspectId: number;
  currentValue: string;
  onValueChange: (studentId: number, aspectId: number, field: 'grade_value' | 'notes', value: string) => void;
}

export default function InputFieldRenderer({
  aspect,
  studentId,
  aspectId,
  currentValue,
  onValueChange,
}: InputFieldRendererProps) {
  const handleChange = (value: string) => {
    onValueChange(studentId, aspectId, 'grade_value', value);
  };

  switch (aspect.input_type) {
    case 'angka':
      return (
        <Input
          type="number"
          min="0"
          max="100"
          value={currentValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="0-100"
          className="w-20"
        />
      );
    
    case 'huruf':
      return (
        <Select value={currentValue} onValueChange={handleChange}>
          <SelectTrigger className="w-20">
            <SelectValue placeholder="-" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">A</SelectItem>
            <SelectItem value="B">B</SelectItem>
            <SelectItem value="C">C</SelectItem>
            <SelectItem value="D">D</SelectItem>
            <SelectItem value="E">E</SelectItem>
          </SelectContent>
        </Select>
      );
    
    case 'biner':
      return (
        <Select value={currentValue} onValueChange={handleChange}>
          <SelectTrigger className="w-24">
            <SelectValue placeholder="-" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Ya">Ya</SelectItem>
            <SelectItem value="Tidak">Tidak</SelectItem>
          </SelectContent>
        </Select>
      );
    
    case 'teks':
      return (
        <Input
          type="text"
          value={currentValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Tercapai/Belum"
          className="w-32"
        />
      );
    
    default:
      return (
        <Input
          type="text"
          value={currentValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Nilai"
          className="w-24"
        />
      );
  }
} 