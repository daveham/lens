const get = (req, res, next) => {
  const data = {
    greeting: 'hello',
    name: req.params.name
  };
  res.send(data);
  next();
};

export function addRoutes(server) {
  server.get('/hello/:name', get);
}
