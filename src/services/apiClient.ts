import request, { AxiosResponse, AxiosError } from 'axios';
import { API } from '../utils/constants.ts';

function redirect(target: string): void {
    window.location.replace(target);
}

async function sendRequest<T>(
    method: string,
    path: string,
    payload?: unknown,
    headers?: Record<string, string>,
): Promise<T> {
    try {
        const response: AxiosResponse<T> = await request(API.BASE_URL + path, {
            headers: headers,
            method: method,
            data: payload,
            withCredentials: method !== 'GET',
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response) {
                // If the error has a response, it means the server responded with an error status
                const serverMessage = error.response.data?.message;
                throw new Error(serverMessage || error.message);
            }
            throw new Error('Network error: ' + error.message);
        }
        throw error;
    }
}

export const apiClient = { redirect, sendRequest };
