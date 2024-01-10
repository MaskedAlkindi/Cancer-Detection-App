import { APIUrls } from '../constants/APIURLS';

export async function handleAddLog(action: string, userToken: string) {
    if (!userToken) {
        throw new Error('User token is required');
    }
    if (!action) {
        throw new Error('Action is required');
    }
    
    try {
        const url = APIUrls.addlog;

        const headers = new Headers();
        headers.append('Authorization', `Bearer ${userToken}`);
        headers.append('Content-Type', 'application/json');

        const body = JSON.stringify({ action });

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: body,
            redirect: 'follow',
        };

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
