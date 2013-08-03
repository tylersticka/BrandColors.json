var http = require('http')
  , cheerio = require('cheerio')
  , fs = require('fs')
  , options = {
      host: 'brandcolors.net',
      port: 80,
      path: '/',
      method: 'GET'
    };

console.log('Getting ' + options.path + ' at ' + options.host + '...')

http.get(options).on('response', function (response) {
  var body = ''
    , i = 0;
  response.on('data', function (chunk) {
    i++;
    body += chunk;
    console.log('Received chunk ' + i + '...');
  });
  response.on('end', function () {
    var $ = cheerio.load(body)
      , $brandColors = $('[data-brand]')
      , result = {};
    console.log('Finished! ' + $brandColors.length + ' brand colors found.');
    console.log('Building JSON object...');
    $brandColors.each(function(){
      var $this = $(this)
        , brand = $this.attr('data-brand')
        , hex = $this.attr('data-hex');
      result[ brand.replace(/\W/g, '').toLowerCase() ] = hex;
    });
    console.log('Saving result to BrandColors.json...');
    fs.writeFile('BrandColors.json', JSON.stringify(result, null, 2), function (error) {
      if (error) {
        console.log(error);
      } else {
        console.log('All done! ^_^');
      }
    });
  });
});