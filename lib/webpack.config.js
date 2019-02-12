var path = require('path');

module.exports = {
      entry: ['./js/scrollarticle.js'],
      output : {
            filename: 'scrollarticle.js',
            path: path.resolve(__dirname, 'dist')
      }
};
