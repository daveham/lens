export default {
  get: (req, res, next) => {
    const data = {
      name: 'three photos',
      source: 'catalog'
    };
    res.send(data);
    next();
  }
};
