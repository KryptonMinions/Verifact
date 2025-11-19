'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase/server';
import { z } from 'zod';
import type { AnalysisResult } from '@/types';

const formSchema = z.object({
  text: z.string().optional(),
  url: z.string().url().optional().or(z.literal('')),
  image: z.any().optional(),
});

export async function handleTextAnalysis(
  prevState: any,
  formData: FormData
): Promise<{ result: AnalysisResult | null; error: string | null }> {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  const rawFormData = {
    text: formData.get('text'),
    url: formData.get('url'),
    image: formData.get('image'),
  };

  const validatedFields = formSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      result: null,
      error: validatedFields.error.errors.map((e) => e.message).join(', '),
    };
  }

  const { text, url, image } = validatedFields.data;
  const claimToTest = [text, url].filter(Boolean).join(' ');

  if (!claimToTest && (!image || image.size === 0)) {
    return {
      result: null,
      error: 'Please provide text, a URL, or an image to analyze.',
    };
  }

  const analysisApiUrl = process.env.EXTERNAL_ANALYSIS_API_URL;

  if (!analysisApiUrl) {
    console.error('EXTERNAL_ANALYSIS_API_URL environment variable is not set.');
    return {
      result: null,
      error: 'The analysis service is not configured correctly. Please contact support.',
    };
  }

  try {
    const apiFormData = new FormData();
    apiFormData.append('text', claimToTest);

    if (image && image.size > 0) {
        apiFormData.append('image', image);
    }

    console.log(`▶️  Sending POST request to: ${analysisApiUrl}`);
    console.log(`▶️  Claim: "${claimToTest}"`);

    const response = await fetch(analysisApiUrl, {
      method: 'POST',
      body: apiFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}. Details: ${errorText}`);
    }

    const result: AnalysisResult = await response.json();

    console.log('\n✅ Success! Agent returned a response:');

    const { data: { user } } = await supabase.auth.getUser();

    const { error: dbError } = await supabase.from('analyses').insert([{
      user_id: user?.id,
      text_input: text,
      url_input: url,
      summary: result.overall_summary,
      analysis_details: result as any,
      sources: result.analyzed_claims.flatMap(claim => 
        claim.supporting_evidence.map(e => e.source)
        .concat(claim.opposing_evidence.map(e => e.source))
        .concat(claim.fact_checking_results.map(r => r.url))
      )
    }]);

    if (dbError) {
      console.error('Error saving to Supabase:', dbError);
    }

    return { result, error: null };

  } catch (e: any) {
    console.error(e);
    return {
      result: null,
      error: e.message || 'An unexpected error occurred during analysis.',
    };
  }
}
