import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';
import { AssessmentAspect } from '../types';

interface FilterPanelProps {
  assessmentAspects: Record<number, AssessmentAspect[]>;
  selectedClass: string;
  selectedSubject: string;
  selectedAspect: string;
  filteredAspects: AssessmentAspect[];
  onClassChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onAspectChange: (value: string) => void;
}

export default function FilterPanel({
  assessmentAspects,
  selectedClass,
  selectedSubject,
  selectedAspect,
  filteredAspects,
  onClassChange,
  onSubjectChange,
  onAspectChange,
}: FilterPanelProps) {
  // Get unique classes from assessment aspects
  const classes = Object.keys(assessmentAspects).map(key => ({
    id: key,
    name: assessmentAspects[parseInt(key)][0]?.curriculum_template?.name || 'Unknown Class'
  }));

  // Get subjects for selected class
  const subjects = selectedClass ? 
    assessmentAspects[parseInt(selectedClass)]?.map(aspect => ({
      id: aspect.id.toString(),
      name: aspect.name
    })) || [] : [];

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
    <Card>
      <CardHeader>
        <CardTitle>Filter Penilaian</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="class">Kelas</Label>
            <Select value={selectedClass} onValueChange={onClassChange}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Kelas" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="subject">Mata Pelajaran</Label>
            <Select 
              value={selectedSubject} 
              onValueChange={onSubjectChange}
              disabled={!selectedClass}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Mata Pelajaran" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="aspect">Aspek Penilaian</Label>
            <Select 
              value={selectedAspect} 
              onValueChange={onAspectChange}
              disabled={!selectedSubject}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Aspek" />
              </SelectTrigger>
              <SelectContent>
                {filteredAspects.map((aspect) => (
                  <SelectItem key={aspect.id} value={aspect.id.toString()}>
                    {aspect.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedAspect && filteredAspects.length > 0 && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Tipe input: <Badge variant="secondary">
                {getInputTypeLabel(filteredAspects[0].input_type)}
              </Badge>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
} 