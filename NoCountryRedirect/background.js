// -----------------------------------------------------------------
// file:	background.js
// what:	does all the work for this extension
// started: 2012.08.13
// note:	see revisions.txt for changelog
//
// - MORE -
// -- miscellaneous test URLs:
//	https://google.com
// 	http://www.google.es/url?sa=t&rct=j&q=&esrc=s&source=web&cd=4&ved=0CH4QFjAD&url=http%3A%2F%2Fwww.chronicles.no%2F2012%2F07%2Ftop-10-alternatives-to-gmail.html&ei=6KcyUI-wEcS5hAe9hIC4Aw&usg=AFQjCNFllV5QgNfwGHT6cwN8a0N2Ze07vQ&sig2=EKq3lPaLL1d4DosFQVJodw
//	http://www.google.no/imgres?start=97&hl=en&client=firefox-a&hs=zxc&sa=X&rls=org.mozilla:en-US:official&biw=1280&bih=620&tbm=isch&prmd=imvns&tbnid=47Cjnrli_pYG2M:&imgrefurl=http://www.chronicles.no/2012/07/mont-blanc-10km-2012.html&docid=wRsjDboEn1XGRM&imgurl=http://3.bp.blogspot.com/-JUQP0mJaBl8/T_CSCtBgiNI/AAAAAAAACyM/Qi7xrBEtrSA/s1600/k009.png&w=983&h=650&ei=X2AwUP2NLOXe4QT-64CADQ&zoom=1&iact=hc&vpx=476&vpy=129&dur=4294&hovh=182&hovw=276&tx=174&ty=115&sig=103807963143718040267&page=5&tbnh=124&tbnw=170&ndsp=27&ved=1t:429,r:16,s:97,i:56
//	http://www.google.pl/imgres?um=1&hl=pl&biw=1600&bih=775&tbm=isch&tbnid=oLFtTiAlda2ZdM:&imgrefurl=http://www.chronicles.no/2012/07/sommerstevne-ii-bislett-2012.html&docid=sE5MS_X81OPcGM&imgurl=http://3.bp.blogspot.com/-uOLBx1OnDBE/UAXwl8OpG-I/AAAAAAAADHo/fVl2RWtz2Co/s1600/allDone.jpg&w=1280&h=960&ei=4i0xUNLWCsjAtAa3-4CACw&zoom=1&iact=hc&vpx=517&vpy=470&dur=419&hovh=194&hovw=259&tx=163&ty=115&sig=104906337058271128867&page=1&tbnh=130&tbnw=184&start=0&ndsp=32&ved=1t:429,r:26,s:0,i:150
//	http://google.co.uk/
//  http://google.com.ua
//	http://siljaifarta.blogspot.no/view/classic
//	http://siljaifarta.blogspot.no
//	http://siljaifarta.blogspot.co.uk/
//	http://siljaifarta.blogspot.com.ua/
//	http://cochinblogs-potpourri.blogspot.in/2012/03/google-has-given-in-to-political.html
//	https://maps.google.no/maps/myplaces?ll=60.3976,5.3179&spn=0.020563,0.066047&ctz=-120&t=m&z=15
//	https://www.google.no/accounts/Logout2?hl=en-GB&service=mail&ile=1&ils=s.NO&ilc=5&continue=https%3A%2F%2Faccounts.google.com%2FServiceLogin%3Fservice%3Dmail%26passive%3Dtrue%26rm%3Dfalse%26continue%3Dhttps%3A%2F%2Fmail.google.com%2Fmail%2F%26ss%3D1%26scc%3D1%26ltmpl%3Ddefault%26ltmplcache%3D2%26hl%3Den-GB&zx=-644258560
//
// -- nifty things to remember:
//	debug("tab.url = " + tab.url);		// alternative: encodeURIComponent(tab.url);
//	debug("tab.title = " + tab.title);	// alternative: encodeURIComponent(tab.title)
//
// -----------------------------------------------------------------


// -----
// simple function that prints debugging messages
// -----
function debug(message){
	var doDebug = false;															// if 'true' then print message, if 'false' do not

	if (doDebug){
		console.log("DEBUG : " + message);
	}
}


// -----
// printing some debugging info, doing some declarations and initialisations of some variables
// -----
debug("NoCountryRedirect - from background.js");								// Hello, World!
debug("NCRify options : [google=" + localStorage["checkbox_google"] + " | blogspot=" + localStorage["checkbox_blogspot"] + "]");

// variables that holds info that defines if domain is to be checked or not
var checkGoogle;
var checkBlogspot;

// initialises local storage in case it is undefined
if ( localStorage["checkbox_google"] === undefined ){
	localStorage["checkbox_google"] = "true";
}
if ( localStorage["checkbox_blogspot"] === undefined ){
	localStorage["checkbox_blogspot"] = "true";
}

// build an array with regular expressions and URLs that are to be checked and NCR'ified if possible
// note that "regExpUrlsToCheck[i]" must be for the same domain as "urlsToCheck[i]" (same order)
var regExpUrlsToCheck = new Array();
regExpUrlsToCheck[0] = new RegExp("^http(s)?://(maps.|www.)?google.\\w{2,3}(.\\w{2,3})?/", "i");
regExpUrlsToCheck[1] = new RegExp("^http(s)?://([a-z0-9\\-]{1,40}.)?blogspot.\\w{2,3}(.\\w{2,3})?/", "i");

var urlsToCheck = new Array();
urlsToCheck[0] = "google";
urlsToCheck[1] = "blogspot";


// -----
// main function that checks URLs, and NCR'ifies those who are to be NCR'ified
// -----
function urlCheck(tabId, changeInfo, tab) {
debug("tabId : " +tabId);
	if (changeInfo.status === "complete"){										// changeInfo is either "loading" or "complete", it is only interesting manipulating the url when loading
		debug("changeInfo is 'complete' hence we stop here");
		return;
	}

	// we need to get these values each time a URL is checked, in case options are changed by the user
	checkGoogle		= (localStorage["checkbox_google"] === "true");
	checkBlogspot	= (localStorage["checkbox_blogspot"] === "true");

	var newUrl;
	var tldCcRegexp			= /\.\w{2,3}(\.\w{2,3})?\//;								// regular expression that represents a country specific tld plus a slash (like '.jp/' or '.no/' or '.co.uk') - note that all URLs given by tab.url will end with a slash.
	var googleRegExp		= new RegExp("^http(s)?://(maps.|www.)?google.\\w{2,3}(.\\w{2,3})?/$", "i");
	var ncrComRegExp		= new RegExp("^http(s)?://([a-z0-9\\-]{1,40}.)?(google|blogspot).com(/ncr)?/", "i");
	var googleLogoutRegExp	= new RegExp("^http(s)?://(www.)?google.\\w{2,3}(.\\w{2,3})?/accounts/Logout");

	debug("urlCheck("+tab.url+")");

	// we only want to process with the URL as long at is not an already .com URL
	// and if it is not a country specific google logout link
	if ( !(tab.url.match(ncrComRegExp)) && !(tab.url.match(googleLogoutRegExp)) ){
		for(var i = 0; i < regExpUrlsToCheck.length; i++) {						// loop through all URLs to check
			debug("regExpUrlsToCheck["+i+"] = " + regExpUrlsToCheck[i]);

			// if we find the pattern given in our regExpUrlsToCheck
			if ( (tab.url.match(regExpUrlsToCheck[i])) ){
				debug("tab.url (" + tab.url + ") matching regExpUrlsToCheck["+i+"] ("+ regExpUrlsToCheck[i] +")");
				newUrl = tab.url;

				if ( urlsToCheck[i].match("google") && checkGoogle ){							// google url
					debug("google url");

					if ( newUrl.match(googleRegExp)){
						debug("short google url");
						newUrl = newUrl.replace(tldCcRegexp, ".com/ncr");		// if nothing is after "google.com/"
					} else {
						debug("long google url");
						newUrl = newUrl.replace(tldCcRegexp, ".com/");			// if URL is longer, like "google.com/?hl=en&...."
					}

				} else if ( urlsToCheck[i].match("blogspot") && checkBlogspot ) {				// blogspot url
					debug("blogspot url");
					newUrl = newUrl.replace(tldCcRegexp, ".com/ncr/");
				} else {														// normally we're here if we user has set NCRify options on domain to 'false'
					debug("NCRify is off for given domain (or we have a dead moth in the system)");
					break;
				}

				debug("newUrl = " + newUrl);
				chrome.tabs.update(tab.id, {url: newUrl});						// update tab URL
				break;															// no point looping any longer
			}
		}
	}

	// display ncr icon for urls that are not country redirected (that are NCRified)
	if ( tab.url.match(ncrComRegExp) ){
		debug("show page action for URL : " + tab.url);
		chrome.pageAction.show(tabId);											// show the page action (the NCR icon)
	}
}


// -----
// Listen for any changes to the URL of any tab.
// -----
chrome.tabs.onUpdated.addListener(urlCheck);

