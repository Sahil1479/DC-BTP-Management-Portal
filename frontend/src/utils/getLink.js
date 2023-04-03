export const getLink = (link) => {
  try {
    link = new URL(link);
    link = link.pathname;
  } catch {}
  let backend = `http://${
    process.env.BACKEND_HOST ? process.env.BACKEND_HOST : '127.0.0.1'
  }:8000`;
  let newLink =
    process.env.NODE_ENV === 'production'
      ? window.location.origin + link
      : backend + link;
  return newLink;
};
