'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

const emailSchema = z.string().email('Invalid email address');
const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');

export async function signUp(prevState: any, formData: FormData) {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  const emailValidation = emailSchema.safeParse(email);
  if (!emailValidation.success) {
    return { message: emailValidation.error.errors[0].message };
  }

  const passwordValidation = passwordSchema.safeParse(password);
  if (!passwordValidation.success) {
    return { message: passwordValidation.error.errors[0].message };
  }

  if (password !== confirmPassword) {
    return { message: 'Passwords do not match' };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        email_confirm: false,
      },
    },
  });

  if (error) {
    return { message: error.message };
  }

  if (data.user) {
    revalidatePath('/', 'layout');
    redirect('/dashboard');
  }

  return { message: 'An unknown error occurred.' };
}

export async function signIn(prevState: any, formData: FormData) {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  const emailValidation = emailSchema.safeParse(email);
  if (!emailValidation.success) {
    return { message: emailValidation.error.errors[0].message };
  }

  const passwordValidation = passwordSchema.safeParse(password);
  if (!passwordValidation.success) {
    return { message: passwordValidation.error.errors[0].message };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { message: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signOut() {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error);
    return;
  }
  
  revalidatePath('/', 'layout');
  redirect('/');
}
