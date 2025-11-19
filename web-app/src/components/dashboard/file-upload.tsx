
'use client';

import { UploadCloud, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useRef, useState, useEffect } from 'react';
import { ImagePreview } from './image-preview';
import { cn } from '@/lib/utils';

type FileUploadProps = {
    file: File | null;
    setFile: (file: File | null, sourceUrl?: string) => void;
    name: string;
};

export function FileUpload({ file, setFile, name }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dataTransferRef = useRef<DataTransfer | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    dataTransferRef.current = new DataTransfer();
    if (file) {
      dataTransferRef.current.items.add(file);
    }
    if (fileInputRef.current) {
        fileInputRef.current.files = dataTransferRef.current.files;
    }
  }, [file]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const items = event.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const pastedFile = items[i].getAsFile();
          if (pastedFile) {
            const sourceUrl = event.clipboardData.getData('text/html').match(/src="([^"]+)"/)?.[1];
            setFile(pastedFile, sourceUrl);
            event.preventDefault();
          }
          break;
        }
      }
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };


  return (
    <div className="mt-2">
      {file ? (
        <div className="relative group">
          <ImagePreview file={file} />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemoveFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={cn("flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed  bg-muted/20 transition-colors",
            isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/30',
          )}
          onClick={() => fileInputRef.current?.click()}
          onPaste={handlePaste}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="text-center pointer-events-none">
            <UploadCloud className={cn("mx-auto h-12 w-12 transition-colors", isDragging ? 'text-primary' : 'text-muted-foreground')} />
            <p className="mt-4 font-semibold text-foreground">
              <span className={cn("transition-colors", isDragging ? 'text-primary' : 'text-primary')}>Select File</span>, paste, or drag and drop
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Images (JPEG, PNG, WEBP)
            </p>
          </div>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        name={name}
      />
    </div>
  );
}
