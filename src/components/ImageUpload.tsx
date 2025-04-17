import React from 'react';
import { useDropzone, type DropzoneOptions } from 'react-dropzone';
import { Card, CardContent } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';

interface ImageUploadProps {
  onUpload: (file: File, coords?: { lat: number; lng: number }) => void;
  isLoading: boolean;
}

export const ImageUpload = ({
  onUpload,
  isLoading,
}: ImageUploadProps): React.ReactElement => {
  const [manualLat, setManualLat] = React.useState<string>('');
  const [manualLng, setManualLng] = React.useState<string>('');

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const coords = manualLat && manualLng 
        ? { lat: parseFloat(manualLat), lng: parseFloat(manualLng) }
        : undefined;
      onUpload(acceptedFiles[0], coords);
    }
  }, [onUpload, manualLat, manualLng]);

  const dropzoneOptions: DropzoneOptions = {
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    disabled: isLoading,
    multiple: false
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneOptions);

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                <path d="M16 5h6v6"></path>
                <path d="M8 12l3 3 8-8"></path>
              </svg>
            </div>
            
            <div>
              <p className="text-sm font-medium">
                {isLoading ? 'Processing...' : 'Drag and drop an image or click to browse'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supported formats: JPG, PNG
              </p>
            </div>
          </div>
        </div>
        
        {/* Manual coordinate input */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="latitude">Latitude (optional)</Label>
            <Input
              id="latitude"
              type="number"
              placeholder="e.g. 51.505"
              value={manualLat}
              onChange={(e) => setManualLat(e.target.value)}
              disabled={isLoading}
              step="any"
            />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude (optional)</Label>
            <Input
              id="longitude"
              type="number"
              placeholder="e.g. -0.09"
              value={manualLng}
              onChange={(e) => setManualLng(e.target.value)}
              disabled={isLoading}
              step="any"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};