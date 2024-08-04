import { IUser } from '../types/interfaces';

const apiRequest = async (url: string, method: string, body?: any) => {
  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Error in api request! status: ${response.status}`);
  }
  return response.json();
};

const login = async (name: string) => {
  try {
    const responseData = await apiRequest(
      'http://localhost:3001/users/login',
      'POST',
      { name }
    );
    const userData: IUser = responseData && responseData.data;
    return userData;
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Failed to login: ${error.message}`);
      throw error;
    }
  }
};

const updateHighScore = async (name: string, score: number) => {
  try {
    const responseData = await apiRequest(
      'http://localhost:3001/users/score',
      'PUT',
      {
        name,
        score,
      }
    );
    const userData: IUser = responseData && responseData.data;
    return userData;
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Failed to update score: ${error.message}`);
    }
  }
};

const UsersApi = {
  login,
  updateHighScore,
};

export default UsersApi;
