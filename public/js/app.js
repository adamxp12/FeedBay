$(document).foundation()


function formgo() {
    // get the value of ebayurl and redirect the page to that url
    var ebayurl = document.getElementById("ebayurl").value.split("https://www.ebay.")[1];

    if(!ebayurl || !ebayurl.includes("/sch/i.html?")) {
        alert("Please enter a valid eBay search URL. Starting with https://www.ebay");
    } else {
        window.location.href = ebayurl.replace("https://www.ebay.", "/").replace("&_rss=1", "");
    }

    
}