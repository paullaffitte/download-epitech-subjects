function getCookie() {
  const date = new Date()
  date.setDate(date.getDate() + 1);

  return {
    domain: 'intra.epitech.eu',
    name: 'user',
    value: process.env.INTRA_TOKEN,
  };
};

module.exports = getCookie;
