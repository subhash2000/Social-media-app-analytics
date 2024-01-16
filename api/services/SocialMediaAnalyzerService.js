module.exports = {
  findWordCountAndAverageWordLength: function (text) {
    if (!text) {
      return { wordCount: 0, averageWordLength: 0 };
    }

    const wordCount = text.split(' ').length;

    const averageWordLength = text.split(' ').reduce((acc, word) => {
      return acc + word.length;
    }, 0) / wordCount;

    return { wordCount, averageWordLength };
  }
};
