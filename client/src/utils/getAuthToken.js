const getAuthToken = () => JSON.parse(localStorage.getItem('dofwUser'));

export default getAuthToken;
