require(`dotenv`).config();
const RSS = require('rss');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
var needle = require('needle');

app.use(express.static('public'));

// This function tries its best to give the same output the now defunct RSS feed provided
// I dont have a way to make the add to watch list button or specific end times for most items because that data is not in the search page
// The is a watch button but its session specific and will generate a 500 error on ebay if you try it on a different session.

const PORT = process.env.PORT || 3000;

function buildTable(obj) {
    var linktext = "Bid Now"
    if(!obj.bidcount) {
        linktext = "Buy It Now"
    }
    if(obj.location) {
        obj.shipping += "<br>"+obj.location;
    }

    return "<table border='0' cellpadding='8'> \
    <tr> \
      <td> \
        <a href='"+obj.url+"' target='_blank'> \
          <img src='"+obj.image+"' height='140px' border='0'/> \
        </a> \
      </td> \
      <td> \
        "+obj.description+"<br> \
        <strong>"+obj.price+" "+obj.bidcount+" \
        </strong> \
        <br>"+obj.shipping+" \
        <br>\
        <a href='"+obj.url+"' target='_blank'>"+linktext+" \
      </td>\
    </tr> \
  </table>"
}

// Actually contact ebay and generate an RSS feed from the scraped results
// This is dumb. but eBay are dumb and I hope their developers get fired for removing such a basic and useful feature
function getFeed(url, callback) {
    needle.get(url, function(error, response) {
  if (!error && response.statusCode == 200)

  response.body = response.body.split('srp-river-answer--REWRITE_START')[0]; // Remove any international or "results with less words" bullshit
  var $ = cheerio.load(response.body);

  if(typeof $ === 'undefined') {
      // The was an error loading the data into cheerio. Likely the URL is malformed.
    callback("Error: No results found. Check the URL. Make sure the is no &_rss=1 on the end of the URL.");
    return;
  }

  // RSS Header info
  var feed = new RSS({
    title: $('title').text(),
    description: "an eBay RSS feed. Because eBay killed this useful feature",
    site_url: url,
    language: 'en',
    generator: 'feedbay.net',
    ttl: '30'
  });

  // Loop over the results and add them to the feed
  $('ul.srp-results > li.s-item').each(function() {
    var LI = cheerio.load(this);
    LI('.LIGHT_HIGHLIGHT').remove(); // Remove the "NEW LISTING" tag from titles because that is frankly useless info in an RSS feed
    var obj = {
        title: LI('.s-item__title').text(),
        description: LI('.s-item__subtitle').text(),
        url: LI('.s-item__link').attr('href').split('?')[0],
        image: LI('.s-item__image-wrapper').children().first().attr('src'),
        price: LI('.s-item__price').text(),
        shipping: LI('.s-item__freeXDays').text() +
              LI('.s-item__localDelivery').text() +
              LI('.s-item__logisticsCost').text(),
        location: LI('.s-item__location').text(),
        bidcount: LI('.s-item__bidCount').text(),
        timeleft: LI('.s-item__time > .s-item__time-left').text(),
        //watchlist: LI('.s-item__watchheart > a').attr('href'), // this url does not work as its tied to the session. Need a rover.ebay alternative
    }

    // Create a valid RSS object as the above object is not valid due to custom data
    // Wanted to split out the logic to build the table so can be changed easily
    var rssobj = {
        title: obj.title,
        description: buildTable(obj),
        url: obj.url,
    }

    // Append item to the feed
    feed.item(rssobj);

  });
  // Return the feed
  callback(feed.xml());
});
}

// Start app

app.get('/sch/i.html',function(req,res){
    getFeed("https://www.ebay.com"+"/sch/i.html"+req.originalUrl.substring(req.originalUrl.indexOf('?')), function(d) {
        res.type('application/xml')
        res.send(d);
    })
})


// Country specific. Simply just passing the tld as a paramter. Not ideal but it works.
app.get('/:country/sch/i.html',function(req,res){
    getFeed("https://www.ebay."+req.params.country+"/sch/i.html"+req.originalUrl.substring(req.originalUrl.indexOf('?')), function(d) {
        res.type('application/xml')
        res.send(d);
    })
})

app.listen(PORT, function() {
    console.log('Listening on port '+PORT+'...');
});

