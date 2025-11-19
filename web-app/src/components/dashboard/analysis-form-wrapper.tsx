
'use client';

import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { handleTextAnalysis } from '@/app/actions';
import { AnalysisForm } from './analysis-form';
import { AnalysisResultsContainer } from './analysis-results-container';
import type { AnalysisResult } from '@/types';
import { useActionState } from 'react';

export function AnalysisFormWrapper() {
  const [state, formAction, isPending] = useActionState(handleTextAnalysis, {
    result: null,
    error: null,
  });
  
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const [showResult, setShowResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    if (isPending) {
        setShowResult(null);
    }
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Error',
        description: state.error,
      });
    }
    if (state.result) {
      setShowResult(state.result);
      formRef.current?.reset();
      // Give time for state to update and DOM to re-render before scrolling
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [state, isPending, toast]);

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
      <div className="w-full">
        <AnalysisForm
            formAction={formAction}
            formRef={formRef}
            isPending={isPending}
        />
      </div>
      <div className="w-full">
        <AnalysisResultsContainer result={showResult} isPending={isPending} ref={resultRef} />
      </div>
    </div>
  );
}
