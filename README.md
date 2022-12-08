# FeedBay
 eBay might of removed RSS but FeedBay adds it back 🖕 eBay.
 
 So in late March 2022 eBay had the great idea that RSS should be removed from their site. Guess their just a bunch of idiots or something because like 90% of my eBay purchases in recent years have been from RSS feeds.
 
 I cant be the only one who needs this so I created FeedBay
 
 The code is bad... but it work. By scraping the web page. Because the beauty of the old RSS feeds was being able to do complex filters via the normal eBay page and then RSSify it. That is what FeedBay aims to replicate.
 
 ## Why not use the API?
 
 The API is dumb. I wanted something that was RSS plain and simple works on any device and does not need authentication etc. Also the wording on eBays API docs imply that the browse API is or should be a paid feature on top of the 5k limit per day

I myself have been using FeedBay for a while now and it has not skiped a beat giving me a near identical response to the old RSS feeds. I figured I should open source it so other people can host their own instance.

I also have a hosted instance you can try out https://feedbay.net but this might not scale for thousands of users hitting it so it is recommended you host yourself 

FeedBay is not endorsed by eBay. I hate the company as their developers seem to be on a one track road to making the UX terrible at every turn. Makes the RSS feeds even more desirable 

# Configuration
 Copy the .env.example to .env then edit to change the port. Default is 3000, so you can reach the server at http://localhost:3000.

# Reverse proxy
 It's recommended to use with Caddy or Nginx as a reverse proxy if you want to serve this on a https domain.

 To use with Caddy, it's simply one code block:
    feedbay.example.com {
        reverse_proxy 127.0.0.1:7171
    }
Where example.com is your personal domain. Don't forget to setup the feedbay subdomain in your DNS provider or setup DNS wildcard support as needed.
