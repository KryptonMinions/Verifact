
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type ImagePreviewProps = {
  file: File;
};

export function ImagePreview({ file }: ImagePreviewProps) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [file]);

  if (!preview) {
    return null;
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
      <Image src={preview} alt="Image preview" fill className="object-contain" />
    </div>
  );
}
