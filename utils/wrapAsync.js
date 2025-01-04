module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next); // Passes any error to the next middleware
  };
};
