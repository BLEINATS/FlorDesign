
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadIcon } from './icons';

interface UploadScreenProps {
  onImageUpload: (imageData: { data: string; mimeType: string }) => void;
  isLoading: boolean;
}

const UploadScreen: React.FC<UploadScreenProps> = ({ onImageUpload, isLoading }) => {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (!file.type.startsWith('image/')) {
        setError('Por favor, envie um arquivo de imagem válido (PNG, JPG, etc.).');
        return;
      }
      const reader = new FileReader();
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        const binaryStr = reader.result as string;
        onImageUpload({ data: binaryStr.split(',')[1], mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.gif', '.webp'] },
    multiple: false,
  });

  return (
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-4xl font-serif text-pink-800 mb-4">Dê vida à sua visão floral</h2>
      <p className="text-lg text-gray-600 mb-8">
        Comece enviando uma foto. Pode ser um arranjo que você admira, um espaço que deseja decorar ou até mesmo um buquê que você montou.
      </p>

      <div
        {...getRootProps()}
        className={`p-12 border-4 border-dashed rounded-xl cursor-pointer transition-colors ${
          isDragActive ? 'border-pink-500 bg-rose-50' : 'border-pink-200 hover:border-pink-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-pink-700">
          <UploadIcon className="h-16 w-16 mb-4" />
          {isDragActive ? (
            <p className="text-xl font-semibold">Solte a imagem aqui...</p>
          ) : (
            <>
              <p className="text-xl font-semibold">Arraste e solte uma imagem aqui, ou clique para selecionar</p>
              <p className="text-gray-500 mt-2">PNG, JPG, GIF, WEBP</p>
            </>
          )}
        </div>
      </div>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default UploadScreen;
