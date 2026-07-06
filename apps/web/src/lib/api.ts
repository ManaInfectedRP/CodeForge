import axios from 'axios';

export const api = axios.create({ baseURL: '/api', withCredentials: true });

export function errorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return (err.response?.data as { error?: string } | undefined)?.error ?? err.message;
  }
  return err instanceof Error ? err.message : 'Something went wrong';
}
