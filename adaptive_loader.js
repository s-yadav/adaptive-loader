const path = require('path');
const loaderUtils = require('loader-utils');

function replaceImports(input, platform){
    const replacePlatform = platform === 'mobile' ? 'DESKTOP' : 'MOBILE';
    const platformRegex = new RegExp(replacePlatform + ':ONLY:START((.|\n)*?)' + replacePlatform + ':ONLY:END', 'g');
    return input.replace(platformRegex, function($1, $2){
      const replacePoint = $1.indexOf($2);
      const updatedImports = $2.replace(/import.*?['"](.*?)['"]|require\(['"](.*?)['"]\)/g, function(fullMatch, importPath, requirePath){
        return fullMatch.replace(importPath || requirePath, 'adaptive-loader/empty_export.js');
      });
      return $1.replace($2, updatedImports);
    });
}

module.exports = function(input) {

  // Parse custom query parameters.
  const query = loaderUtils.parseQuery(this.query);

  if(input.indexOf(':ONLY:START') !== -1){
    input = replaceImports(input, query.platform);
  }

  // Mark the loader as cacheable (same result for same input).
  this.cacheable();

  // Return a result after the transformation has been done.
  return input;
};
