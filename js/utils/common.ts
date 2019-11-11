export const getParams = (url: string) => {
  const getQuery = url.split("?")[1];
  const params = getQuery.split("&");
  return params;
};
