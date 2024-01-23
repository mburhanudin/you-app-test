// utils/httpUtils.ts
const apiUrl = process.env.REACT_APP_API_URL || 'https://techtest.youapp.ai/api';

const handleResponse = async (response: Response) => {
  if (response.ok) {
    return response.json();
  } else {
    const errorData = await response.json();
    const errorMessage = errorData.message || 'Something went wrong';

    // Menangani status 500
    if (response.status === 500) {
      console.error('Internal Server Error:', errorMessage);
    }

    throw new Error(errorMessage);
  }
};

export const getRequest = async (endpoint: string, token: string | null) => {
    try {
      const response = await fetch(`${apiUrl}/${endpoint}`, {
        method: 'GET',
        headers: {
          Accept: '*/*',
          'x-access-token': token || '',
        },
      });
  
      return handleResponse(response);
    } catch (error) {
      throw new Error(`Error during GET request: ${error}`);
    }
  };
  
  export const putRequest = async (endpoint: string, data: Record<string, any>, token: string | null) => {
    try {
      const response = await fetch(`${apiUrl}/${endpoint}`, {
        method: 'PUT',
        headers: {
          Accept: '*/*',
          'x-access-token': token || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      return handleResponse(response);
    } catch (error) {
      throw new Error(`Error during PUT request: ${error}`);
    }
  };

export const postRequest = async (endpoint: string, data: Record<string, any>) => {
  try {
    const response = await fetch(`${apiUrl}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log(response, "JJJJJJ")

    return handleResponse(response);
  } catch (error) {
    throw new Error(`Error during POST request: ${error}`);
  }
};

