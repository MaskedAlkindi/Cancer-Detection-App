import * as FileSystem from 'expo-file-system';

async function handleGetPrediction(imageUri) {
  try {
    // Read the image file asynchronously
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    const { uri } = fileInfo;
    
    // Read the file content
    const fileContent = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

    // Set your Hugging Face API model endpoint
    const modelEndpoint =
      'https://api-inference.huggingface.co/models/gianlab/swin-tiny-patch4-window7-224-finetuned-skin-cancer';

    // Replace "{API_TOKEN}" with your actual API token from hugging face
    const apiToken = '';

    // Send a POST request to the Hugging Face Inference API
    const response = await fetch(modelEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: fileContent }),
    });

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    // Parse the JSON response
    const result = await response.json();

    // Log the response to the console
    console.log(JSON.stringify(result));

    // Return the result if needed
    return result;
  } catch (error) {
    console.error('An error occurred:', error.message);
    throw error; // Propagate the error if necessary
  }
}

export default handleGetPrediction;