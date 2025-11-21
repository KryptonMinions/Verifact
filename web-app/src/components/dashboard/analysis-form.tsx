'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileUpload } from './file-upload';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button type="submit" disabled={isPending} className="w-full md:w-auto">
      {isPending && <Loader2 className="animate-spin" />}
      Analyze Content
    </Button>
  );
}

type AnalysisFormProps = {
  formAction: (payload: FormData) => void;
  formRef: React.RefObject<HTMLFormElement>;
  isPending: boolean;
};

export function AnalysisForm({ formAction, formRef, isPending }: AnalysisFormProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleTextPaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = event.clipboardData.getData('text');
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = pastedText.match(urlRegex);

    if (urls && urls.length > 0) {
      const url = urls[0];
      const textWithoutUrl = pastedText.replace(url, '').trim();

      if (formRef.current) {
        const urlInput = formRef.current.elements.namedItem('url') as HTMLInputElement;
        const textInput = event.currentTarget;

        if (urlInput) {
          event.preventDefault();
          urlInput.value = url;
          textInput.value = textWithoutUrl;
          // Manually trigger change event for react state if needed
          const nativeTextSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
          nativeTextSetter?.call(textInput, textWithoutUrl);
          const ev = new Event('input', { bubbles: true });
          textInput.dispatchEvent(ev);
        }
      }
    }
  };

  const handleImagePaste = (pastedFile: File | null, sourceUrl?: string) => {
    setFile(pastedFile);
    if (sourceUrl && formRef.current) {
      const urlInput = formRef.current.elements.namedItem('url') as HTMLInputElement;
      if (urlInput) {
        urlInput.value = sourceUrl;
      }
    }
  };

  return (
    <Card className='h-fit'>
      <CardHeader>
        <div className='flex justify-between items-center'>
          <div>
            <CardTitle>Content Submission</CardTitle>
            <CardDescription>
              Submit content in any format below for analysis.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <form ref={formRef} action={formAction}>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Text Content</h3>
            <Textarea
              name="text"
              placeholder="Paste text content here for analysis..."
              className="min-h-64 text-base"
              onPaste={handleTextPaste}
            />
          </div>
          <div>
            <h3 className="font-medium mb-2">URL</h3>
            <Input name="url" placeholder="https://example.com/article-to-analyze" />
          </div>
          <div>
            <h3 className="font-medium mb-2">Media File (Image, Audio, or Video)</h3>
            <FileUpload file={file} setFile={handleImagePaste} name="media" />
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <SubmitButton isPending={isPending} />
        </CardFooter>
      </form>
    </Card>
  );
}
