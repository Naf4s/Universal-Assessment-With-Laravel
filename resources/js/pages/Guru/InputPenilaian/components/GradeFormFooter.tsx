import React from 'react';
import { Button } from '@/components/ui/button';

interface GradeFormFooterProps {
  processing: boolean;
  onReset: () => void;
}

export default function GradeFormFooter({
  processing,
  onReset,
}: GradeFormFooterProps) {
  return (
    <div className="mt-6 flex justify-end space-x-4">
      <Button
        type="button"
        variant="outline"
        onClick={onReset}
      >
        Reset
      </Button>
      <Button type="submit" disabled={processing}>
        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
      </Button>
    </div>
  );
} 