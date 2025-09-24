
import React, { useRef } from 'react';
import Spinner from './Spinner';

interface UploadScreenProps {
  onImageUpload: (file: File) => void;
  isLoading: boolean;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);


const UploadScreen: React.FC<UploadScreenProps> = ({ onImageUpload, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
      <h2 className="text-4xl font-serif text-pink-800 mb-2">Bring Your Floral Vision to Life</h2>
      <p className="text-lg text-gray-600 mb-8">
        Start by uploading a photo of your space, an existing arrangement, or a floor plan.
      </p>
      <div
        className="w-full h-64 border-2 border-dashed border-pink-300 rounded-xl flex flex-col items-center justify-center bg-white cursor-pointer hover:bg-rose-100 transition-colors"
        onClick={handleClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={isLoading}
        />
        {isLoading ? (
          <div className="flex flex-col items-center">
            <Spinner />
            <p className="mt-4 text-gray-600">Processing Image...</p>
          </div>
        ) : (
          <>
            <UploadIcon />
            <p className="mt-4 text-gray-600">
              <span className="font-semibold text-pink-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadScreen;
