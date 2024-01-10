import { APIUrls } from '../constants/APIURLS';

export async function handleGetPharmacies(accessToken: string) {
    if (!accessToken) {
        throw new Error('Access token is required');
    }

    try {
        const url = APIUrls.pharmacies;

        const headers = new Headers();
        headers.append('Authorization', `Bearer ${accessToken}`);
        headers.append('Content-Type', 'application/json');

        const requestOptions = {
            method: 'GET',
            headers: headers,
            redirect: 'follow',
        };

        const response = await fetch(url, requestOptions as RequestInit);

        // Log the response for development purposes
        console.log('Response:', response);

        if (!response.ok) {
            throw new Error(`Error during GET request. Status: ${response.status}`);
        }

        return await response.json();
    } catch (error: any) {
        console.error('Error during GET request:', error);
        throw new Error('Error during GET request');
    }
}
