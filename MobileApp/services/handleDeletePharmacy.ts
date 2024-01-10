// handleDeletePharmacy.ts
import { APIUrls } from '../constants/APIURLS';

export async function handleDeletePharmacy(pharmacyId: string, userToken: string) {
    if (!userToken) {
        throw new Error('User token is required');
    }
    if (!pharmacyId) {
        throw new Error('Pharmacy ID is required');
    }

    try {
        const url = `${APIUrls.deletepharmacy}/${pharmacyId}`;

        const headers = new Headers();
        headers.append('Authorization', `Bearer ${userToken}`);

        const requestOptions = {
            method: 'DELETE',
            headers: headers,
            redirect: 'follow',
        };
        console.log('Request options:', requestOptions);
        const response = await fetch(url, requestOptions as RequestInit);

        // Log the raw response for debugging
        const responseText = await response.text();
        console.log('Raw response:', responseText);

        if (!response.ok) {
            throw new Error(`Error during DELETE request. Status: ${response.status}`);
        }

        try {
            return JSON.parse(responseText);
        } catch (e) {
            return responseText;
        }
    } catch (error: any) {
        console.error('Error during DELETE request:', error);
        throw new Error('Error during DELETE request');
    }
}
