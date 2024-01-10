// handleAddPharmacy.ts
import { APIUrls } from '../constants/APIURLS';

export async function handleAddPharmacy(formData: FormData, userToken: string) {
    if (!userToken) {
        throw new Error('User token is required');
    }
    if (!formData) {
        throw new Error('Request body is required');
    }
    
    try {
        const url = APIUrls.addpharmacy;

        const headers = new Headers();
        headers.append('Authorization', `Bearer ${userToken}`);
        // Don't set Content-Type for FormData, the browser will set it with the correct boundary

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: formData,
            redirect: 'follow',
        };
        console.log('Request options:', requestOptions);
        const response = await fetch(url, requestOptions as RequestInit);

        // Log the raw response for debugging
        const responseText = await response.text();
        console.log('Raw response:', responseText);

        if (!response.ok) {
            throw new Error(`Error during POST request. Status: ${response.status}`);
        }

        try {
            return JSON.parse(responseText);
        } catch (e) {
            return responseText;
        }
    } catch (error: any) {
        console.error('Error during POST request:', error);
        throw new Error('Error during POST request');
    }
}