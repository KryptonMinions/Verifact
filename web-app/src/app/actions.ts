'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase/server';
import { z } from 'zod';
import type { AnalysisResult } from '@/types';

const formSchema = z.object({
  text: z.string().optional(),
  url: z.string().url().optional().or(z.literal('')),
  media: z.any().optional(),
  source: z.string().optional(),
});

export async function handleTextAnalysis(
  prevState: any,
  formData: FormData
): Promise<{ result: AnalysisResult | null; error: string | null }> {
  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore);

  const rawFormData = {
    text: formData.get('text'),
    url: formData.get('url'),
    media: formData.get('media'),
    source: formData.get('source'),
  };

  const validatedFields = formSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      result: null,
      error: validatedFields.error.errors.map((e) => e.message).join(', '),
    };
  }

  const { text, url, media, source } = validatedFields.data;
  const claimToTest = [text, url].filter(Boolean).join(' ');

  if (!claimToTest && (!media || media.size === 0)) {
    return {
      result: null,
      error: 'Please provide text, a URL, or a media file to analyze.',
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

    // Only append text if it's not empty
    if (claimToTest) {
      apiFormData.append('text', claimToTest);
    }

    if (media && media.size > 0) {
      apiFormData.append('file', media);
    }

    // Append source if provided
    if (source) {
      apiFormData.append('source', source);
    }

    console.log(`▶️  Sending POST request to: ${analysisApiUrl}`);
    console.log(`▶️  Claim: "${claimToTest}"`);

    // Create AbortController with timeout for long-running image analysis
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.error('⏱️ Request timeout after 3 minutes');
    }, 180000); // 3 minutes timeout

    let response;
    try {
      response = await fetch(analysisApiUrl, {
        method: 'POST',
        body: apiFormData,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId); // Clear timeout if request completes
    }

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
      source_input: source,
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

    // Provide more specific error messages
    let errorMessage = e.message || 'An unexpected error occurred during analysis.';

    if (e.name === 'AbortError') {
      errorMessage = 'The analysis request timed out after 3 minutes. The image may be too large or the service is experiencing delays. Please try again or use a smaller image.';
    } else if (e.message?.includes('fetch failed') || e.message?.includes('socket')) {
      errorMessage = 'Failed to connect to the analysis service. The backend may be processing the request or experiencing connection issues. Please try again in a moment.';
    }

    return {
      result: null,
      error: errorMessage,
    };
  }
}

export async function handleImageSearch(
  prevState: any,
  formData: FormData
): Promise<{ result: any | null; error: string | null }> {
  const media = formData.get('media') as File;

  if (!media || media.size === 0) {
    return {
      result: null,
      error: 'Please provide an image to search.',
    };
  }

  const analysisApiUrl = process.env.RIS_SERVICE_URL;
  if (!analysisApiUrl) {
    return { result: null, error: 'Analysis service not configured.' };
  }

  // Construct the RIS endpoint URL
  // Assumes EXTERNAL_ANALYSIS_API_URL is like "http://host:port/" or "http://host:port"
  const baseUrl = analysisApiUrl.endsWith('/') ? analysisApiUrl.slice(0, -1) : analysisApiUrl;
  const risEndpoint = `${baseUrl}/generate-timeline`;

  try {
    const apiFormData = new FormData();
    apiFormData.append('file', media);

    console.log(`▶️  Sending RIS request to: ${risEndpoint}`);

    const response = await fetch(risEndpoint, {
      method: 'POST',
      body: apiFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`RIS request failed: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    return { result, error: null };

  } catch (e: any) {
    console.error('RIS Error:', e);
    return {
      result: null,
      error: e.message || 'Failed to perform reverse image search.',
    };
  }
}
