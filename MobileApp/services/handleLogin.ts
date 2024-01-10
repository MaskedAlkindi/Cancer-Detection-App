import { APIUrls } from '../constants/APIURLS';



export async function handleLogin(username: string, password: string) {
    if (!(username && password)) {
        throw new Error('Username and password are required');
    }

    try {
        console.log(username, password);

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({ username, password }),
            redirect: "follow",
        };
        
        const response = await fetch(APIUrls.login, requestOptions as RequestInit);
        
        if (response.status !== 200) {
            throw new Error('Error during login');
        }

        return await response.json();
    } catch (error: any) {
        console.error('Error during login:', error);
        throw new Error('Error during login');
    }
}

export async function handleSignup(username: string, password: string, email: string, role: string) {
    if (!(username && password && email && role)) {
        throw new Error('All inputs are required');
    }

    try {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const body = JSON.stringify({ username, password, email, role })
        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: body,
            redirect: "follow",
        };
       
        
        const response = await fetch(APIUrls.signup, requestOptions as RequestInit);
        console.log("resonpse", response.status);
        if (response.status !== 201) {
            throw new Error('Error during user registration');
        }

        return await response;
    } catch (error: any) {
        console.error('Error during user registration:', error);
        if (error.response) {
            console.error('Server response:', error.response);
        }
        throw new Error(error.message || 'Error during user registration');
    }
}
