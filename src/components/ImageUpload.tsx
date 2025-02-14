import React from 'react';
import { useDropzone, type DropzoneOptions } from 'react-dropzone';
import { Card } from './ui/card';

interface ImageUploadProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

export const ImageUpload = ({
  onUpload,
  isLoading,
}: ImageUploadProps): React.ReactElement => {
  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

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
    <Card
      {...getRootProps()}
      className={`p-8 text-center cursor-pointer border-dashed ${
        isDragActive ? 'border-primary' : 'border-gray-300'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      {isLoading ? (
        <p>Processing image...</p>
      ) : isDragActive ? (
        <p>Drop the image here...</p>
      ) : (
        <p>Drag & drop an image here, or click to select one</p>
      )}
    </Card>
  );
};