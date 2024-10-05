const host = process.env.REACT_APP_HOST_URL;

const routes = {
  getAuth: (type) => [host, type].join('/'),
  getURL: (type) => [host, type].join('/'),
};

export default routes;
