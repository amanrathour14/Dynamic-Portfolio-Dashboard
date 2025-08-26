// Client-side API wrapper for making requests to the backend.

const API_BASE_URL = '';

export const getPortfolio = async () => {
  const response = await fetch(`/api/portfolio`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getQuotes = async (symbols) => {
  const response = await fetch(`/api/quotes?symbols=${symbols.join(',')}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getMetrics = async (symbols) => {
  const response = await fetch(`/api/metrics?symbols=${symbols.join(',')}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
