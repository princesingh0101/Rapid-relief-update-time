import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ images, onChange, maxImages = 5 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(Array.from(files));
    }
  };

  const handleFiles = (fileList: File[]) => {
    const newImages = [...images];
    fileList.forEach(file => {
      if (newImages.length < maxImages && file.type.startsWith('image/')) {
        // In a real app, you'd upload to a server/storage here.
        // For this mock, we'll use URL.createObjectURL
        newImages.push(URL.createObjectURL(file));
      }
    });
    onChange(newImages);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files) {
      handleFiles(Array.from(files));
    }
  };

  return (
    <div className="space-y-4">
      <div 
        onClick={() => fileInputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative cursor-pointer group border-2 border-dashed rounded-2xl p-8 transition-all duration-300 flex flex-col items-center justify-center text-center ${
          isDragging 
            ? 'border-medical-500 bg-medical-50/50 dark:bg-medical-900/20 scale-[1.01]' 
            : 'border-slate-200 dark:border-slate-800 hover:border-medical-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
        }`}
      >
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange}
        />
        
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${isDragging ? 'bg-medical-100 text-medical-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}>
          <Upload size={32} />
        </div>
        
        <div>
          <p className="font-bold text-slate-900 dark:text-white">Click or drag images here</p>
          <p className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-wider">Supports JPG, PNG (Max {maxImages} photos)</p>
        </div>

        {isDragging && (
          <div className="absolute inset-0 bg-medical-500/5 rounded-2xl pointer-events-none animate-pulse border-2 border-medical-500 shadow-lg shadow-medical-500/10"></div>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {images.map((img, idx) => (
            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-200 dark:border-slate-800 shadow-sm animate-fade-in">
              <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                  <X size={16} />
                </button>
              </div>
              {idx === 0 && (
                <div className="absolute top-2 left-2 bg-medical-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">MAIN</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;