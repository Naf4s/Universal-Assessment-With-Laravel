import React from 'react';
import { Button } from '@/components/ui/button';

interface TemplateHeaderProps {
    templateName: string;
    description: string;
    viewMode: 'details' | 'aspects';
    onViewModeChange: (mode: 'details' | 'aspects') => void;
}

const TemplateHeader: React.FC<TemplateHeaderProps> = ({
    templateName,
    description,
    viewMode,
    onViewModeChange,
}) => {
    return (
        <header className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{templateName}</h1>
                <p className="text-gray-600 mt-2">{description}</p>
            </div>
            <nav className="flex gap-2">
                <Button
                    variant={viewMode === 'details' ? 'default' : 'outline'}
                    onClick={() => onViewModeChange('details')}
                >
                    Detail Template
                </Button>
                <Button
                    variant={viewMode === 'aspects' ? 'default' : 'outline'}
                    onClick={() => onViewModeChange('aspects')}
                >
                    Atur Aspek
                </Button>
            </nav>
        </header>
    );
};

export default TemplateHeader;
