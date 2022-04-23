const limitCharacters = (lenghtProperty, limit) => {
  if (lenghtProperty) {
    if (lenghtProperty > limit) {
      return false;
    }
    return true;
  }
};

module.exports = {
  limitCharacters,
};
