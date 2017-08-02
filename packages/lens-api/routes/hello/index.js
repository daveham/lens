export default {
  get: (req, res, next) => {
    const data = {
      greeting: 'hello',
      name: req.params.name
    };
    res.send(data);
    next();
  }
};
