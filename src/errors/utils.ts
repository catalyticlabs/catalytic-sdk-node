import { AxiosError } from 'axios';

// AxiosError is an interface not a class, so this guard is used to determine if it is an AxiosError
export const isAxiosError = <T>(error: Error): error is AxiosError<T> => (error as AxiosError).isAxiosError || false;
