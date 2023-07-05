const getAuthToken = () => JSON.parse(localStorage.getItem('greenApiUser'));

export default getAuthToken;
