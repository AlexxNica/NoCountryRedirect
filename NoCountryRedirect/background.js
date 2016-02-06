// -----------------------------------------------------------------
// file:    background.js
// what:    does all the work for this extension
// started: 2012.08.13
// note:    see revisions.txt for changelog
//
// -- miscellaneous test URLs to run through before each new release:
//  https://google.com
//  http://www.google.es/url?sa=t&rct=j&q=&esrc=s&source=web&cd=4&ved=0CH4QFjAD&url=http%3A%2F%2Fwww.chronicles.no%2F2012%2F07%2Ftop-10-alternatives-to-gmail.html&ei=6KcyUI-wEcS5hAe9hIC4Aw&usg=AFQjCNFllV5QgNfwGHT6cwN8a0N2Ze07vQ&sig2=EKq3lPaLL1d4DosFQVJodw
//  http://www.google.no/imgres?start=97&hl=en&client=firefox-a&hs=zxc&sa=X&rls=org.mozilla:en-US:official&biw=1280&bih=620&tbm=isch&prmd=imvns&tbnid=47Cjnrli_pYG2M:&imgrefurl=http://www.chronicles.no/2012/07/mont-blanc-10km-2012.html&docid=wRsjDboEn1XGRM&imgurl=http://3.bp.blogspot.com/-JUQP0mJaBl8/T_CSCtBgiNI/AAAAAAAACyM/Qi7xrBEtrSA/s1600/k009.png&w=983&h=650&ei=X2AwUP2NLOXe4QT-64CADQ&zoom=1&iact=hc&vpx=476&vpy=129&dur=4294&hovh=182&hovw=276&tx=174&ty=115&sig=103807963143718040267&page=5&tbnh=124&tbnw=170&ndsp=27&ved=1t:429,r:16,s:97,i:56
//  http://www.google.pl/imgres?um=1&hl=pl&biw=1600&bih=775&tbm=isch&tbnid=oLFtTiAlda2ZdM:&imgrefurl=http://www.chronicles.no/2012/07/sommerstevne-ii-bislett-2012.html&docid=sE5MS_X81OPcGM&imgurl=http://3.bp.blogspot.com/-uOLBx1OnDBE/UAXwl8OpG-I/AAAAAAAADHo/fVl2RWtz2Co/s1600/allDone.jpg&w=1280&h=960&ei=4i0xUNLWCsjAtAa3-4CACw&zoom=1&iact=hc&vpx=517&vpy=470&dur=419&hovh=194&hovw=259&tx=163&ty=115&sig=104906337058271128867&page=1&tbnh=130&tbnw=184&start=0&ndsp=32&ved=1t:429,r:26,s:0,i:150
//  http://google.co.uk/
//  http://google.com.ua
//  https://google.com.ua
//  http://siljaifarta.blogspot.no/view/classic
//  http://siljaifarta.blogspot.no
//  http://siljaifarta.blogspot.co.uk/
//  http://siljaifarta.blogspot.com.ua/
//  http://cochinblogs-potpourri.blogspot.in/2012/03/google-has-given-in-to-political.html
//  http://www.etvanligliv.blogspot.no/
//  https://maps.google.no/maps/myplaces?ll=60.3976,5.3179&spn=0.020563,0.066047&ctz=-120&t=m&z=15
//  https://maps.google.no
//  https://maps.google.com
//  https://www.google.no/maps/@59.9288516,10.7582299,15z
//  https://www.google.no/maps?source=tldsi&hl=en&hl=en
//  http://books.google.no/
//  https://www.google.com/flights
//  https://www.google.com/flights/
//  https://www.google.com/flights/#
//  https://www.google.no/flights/#search;f=OSL;t=MLA;d=2016-05-21;r=2016-05-25;md=540
//
//  should NOT redirect:
//  https://www.google.no/accounts/Logout2?hl=en-GB&service=mail&ile=1&ils=s.NO&ilc=5&continue=https%3A%2F%2Faccounts.google.com%2FServiceLogin%3Fservice%3Dmail%26passive%3Dtrue%26rm%3Dfalse%26continue%3Dhttps%3A%2F%2Fmail.google.com%2Fmail%2F%26ss%3D1%26scc%3D1%26ltmpl%3Ddefault%26ltmplcache%3D2%26hl%3Den-GB&zx=-644258560
// -----------------------------------------------------------------

// config variables
var number_of_redirects_before_exit     = 3;                                                                                                // the number of redirects that is tried, before giving up on "NCR'ifying" an url
var number_of_milliseconds_before_reset = 5000;                                                                                             // local storage for a tab is reset after this many milliseconds
var tab_status_to_work_with             = "loading";                                                                                        // tab status is either 'undefined', 'loading' or 'complete'


// prints debugging messages
function debug(message, status){
    var doDebug = false;                                                                                                                    // if 'true' then print message, if 'false' do not

    if (doDebug){
        if (status === tab_status_to_work_with){                                                                                            // to minimise output when debugging, we can ignore printing for some tab statuses
            console.log("DEBUG : " + message);
        }
    }
}


// printing some debugging info, doing some declarations and initialisations of some variables
debug("NoCountryRedirect - background.js", tab_status_to_work_with);                                                                        // Hello, World!
debug("NCRify options : [google=" + localStorage["ncr_checkbox_google"] + " | blogspot=" + localStorage["ncr_checkbox_blogspot"] + "]", tab_status_to_work_with);

// initialises local storage for user inputs, in case they are undefined
if ( localStorage["ncr_checkbox_google"] === undefined ){
    localStorage["ncr_checkbox_google"] = "true";
}
if ( localStorage["ncr_checkbox_blogspot"] === undefined ){
    localStorage["ncr_checkbox_blogspot"] = "true";
}
if ( localStorage["ncr_checkbox_icon"] === undefined ){
    localStorage["ncr_checkbox_icon"] = "true";
}
if ( localStorage["ncr_whitelist_1"] === undefined ){
    localStorage["ncr_whitelist_1"] = "";
}
if ( localStorage["ncr_whitelist_2"] === undefined ){
    localStorage["ncr_whitelist_2"] = "";
}
if ( localStorage["ncr_whitelist_3"] === undefined ){
    localStorage["ncr_whitelist_3"] = "";
}
if ( localStorage["ncr_whitelist_4"] === undefined ){
    localStorage["ncr_whitelist_4"] = "";
}
if ( localStorage["ncr_whitelist_5"] === undefined ){
    localStorage["ncr_whitelist_5"] = "";
}
if ( localStorage["ncr_whitelist_6"] === undefined ){
    localStorage["ncr_whitelist_6"] = "";
}
if ( localStorage["ncr_whitelist_7"] === undefined ){
    localStorage["ncr_whitelist_7"] = "";
}
if ( localStorage["ncr_whitelist_8"] === undefined ){
    localStorage["ncr_whitelist_8"] = "";
}
if ( localStorage["ncr_whitelist_9"] === undefined ){
    localStorage["ncr_whitelist_9"] = "";
}
if ( localStorage["ncr_whitelist_10"] === undefined ){
    localStorage["ncr_whitelist_10"] = "";
}

// build an array with regular expressions and URLs that are to be checked and NCR'ified if possible
// note that "regExpUrlsToCheck[i]" must be for the same domain as "urlsToCheck[i]" (the same order)
var regExpUrlsToCheck   = new Array();
regExpUrlsToCheck[0]    = new RegExp("^http(s)?://(books.|maps.|www.)?google.\\w{2,3}(.\\w{2,3})?/", "i");                                  // google domains
regExpUrlsToCheck[1]    = new RegExp("^http(s)?://([a-z0-9\\-]{1,40}.)?([a-z0-9\\-]{1,40}.)?blogspot.\\w{2,3}(.\\w{2,3})?/", "i");          // blogspot domains (including domains on the format "http://www.etvanligliv.blogspot.no/")

var urlsToCheck         = new Array();
urlsToCheck[0]          = "google";
urlsToCheck[1]          = "blogspot";


// main function that checks URLs, and NCR'ifies those URLs who are to be NCR'ified
function urlCheck(tabId, changeInfo, tab) {
    debug("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -", changeInfo.status);
    debug("tabId : " + tabId, changeInfo.status);
    debug("tab.url : " +tab.url, changeInfo.status);
    debug("changeInfo.status : " + changeInfo.status, changeInfo.status);

    // declarations
    var newUrl;
    var tldCcRegexp         = /\.\w{2,3}(\.\w{2,3})?\//;                                                                                    // regular expression that represents a country specific tld plus a slash (like '.jp/' or '.no/' or '.co.uk') - note that all URLs given by tab.url will end with a slash.
    var googleRegExp        = new RegExp("^http(s)?://(books.|maps.|www.)?google.\\w{2,3}(.\\w{2,3})?/$", "i");
    var ncrComRegExp        = new RegExp("^http(s)?://([a-z0-9\\-]{1,40}.)?([a-z0-9\\-]{1,40}.)?(google|blogspot).com(/ncr)?/", "i");
    var googleLogoutRegExp  = new RegExp("^http(s)?://(www.)?google.\\w{2,3}(.\\w{2,3})?/accounts/Logout");
    var googleFlightsRegExp = new RegExp("^http(s)?://(www.)?google.\\w{2,3}(.\\w{2,3})?/flights");
    var chromeExtRegExp     = new RegExp("^chrome");
    var bloggerBareDomain   = new RegExp("^http(s)?://(www.)?blogspot.\\w{2,3}");
    var mapsTldRedirect     = new RegExp("^http(s)?://(www.)?google.\\w{2,3}(.\\w{2,3})?/maps\\?");                                         // endless loops created by jumping to "https://www.google.com/maps?source=tldsi&hl=en" (NCR-13)

    var i;
    var checkGoogle;
    var checkBlogspot;

    // ----- ---------------------------------------------------------------------------------------------
    // misc checks which in certain cases will stop the extension (return without doing anything)
    // -----
    // checks to avoid all the code being run every time the "onUpdated" event is triggered, which is more often than just reloads
    // changeInfo is either 'undefined', 'loading' or 'complete'
    if (changeInfo.status !== tab_status_to_work_with){
        debug("STOP : changeInfo.status differs to '"+tab_status_to_work_with+"'", changeInfo.status);
        return;
    }

    // stop the extension if the tab is a chrome page (like new tab, or settings page), instead of a normal web page
    if ( tab.url.match(chromeExtRegExp) ){
        debug("STOP : we have a chrome page", changeInfo.status);
        return;
    }

    // stop the extension if the url matches a whitelist entry made by the user
    if (
               (tab.url.match(localStorage["ncr_whitelist_1"]) && localStorage["ncr_whitelist_1"] !== "")
            || (tab.url.match(localStorage["ncr_whitelist_2"]) && localStorage["ncr_whitelist_2"] !== "")
            || (tab.url.match(localStorage["ncr_whitelist_3"]) && localStorage["ncr_whitelist_3"] !== "")
            || (tab.url.match(localStorage["ncr_whitelist_4"]) && localStorage["ncr_whitelist_4"] !== "")
            || (tab.url.match(localStorage["ncr_whitelist_5"]) && localStorage["ncr_whitelist_5"] !== "")
            || (tab.url.match(localStorage["ncr_whitelist_6"]) && localStorage["ncr_whitelist_6"] !== "")
            || (tab.url.match(localStorage["ncr_whitelist_7"]) && localStorage["ncr_whitelist_7"] !== "")
            || (tab.url.match(localStorage["ncr_whitelist_8"]) && localStorage["ncr_whitelist_8"] !== "")
            || (tab.url.match(localStorage["ncr_whitelist_9"]) && localStorage["ncr_whitelist_9"] !== "")
            || (tab.url.match(localStorage["ncr_whitelist_10"]) && localStorage["ncr_whitelist_10"] !== "")
        ){
        debug("STOP : tab.url matches whitelist : " +localStorage["ncr_whitelist_1"]+ " : " +localStorage["ncr_whitelist_2"]+ " : " +localStorage["ncr_whitelist_3"]+ " : " +localStorage["ncr_whitelist_4"]+ " : " +localStorage["ncr_whitelist_5"]+ " : " +localStorage["ncr_whitelist_6"]+ " : " +localStorage["ncr_whitelist_7"]+ " : " +localStorage["ncr_whitelist_8"]+ " : " +localStorage["ncr_whitelist_9"]+ " : " +localStorage["ncr_whitelist_10"], changeInfo.status);
        return;
    }
    // -----
    // / end of stop checks
    // ----- ---------------------------------------------------------------------------------------------

    // initialise timestamp for tab
    if ( localStorage["ncr_tab" + tab.id + "_timestamp"] === undefined ){
        localStorage["ncr_tab" + tab.id + "_timestamp"] = Date.now();                                                                       // The now() method returns the milliseconds elapsed since 1 January 1970 00:00:00 UTC up until now as a Number. ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
    }

    // if there are more than x seconds since stored timestamp, we can assume it is the user changing the url (typing, clicking a link etc.)
    // and hence we delete stored data for this tab, and start checking once again
    if ( localStorage["ncr_tab" + tab.id + "_timestamp"] < Date.now() - number_of_milliseconds_before_reset ){
        debug("deleting stored tab data, due to time delay");
        localStorage["ncr_tab" + tab.id + "_timestamp"] = Date.now();                                                                       // reset timestamp
        localStorage.removeItem("ncr_tab" + tab.id + "_break");                                                                             // delete breaks, if any...
        for (i = 1; i <= number_of_redirects_before_exit; i=i+1){                                                                           // delete urls
            localStorage.removeItem("ncr_tab" + tab.id + "_url_" + i);
        }
    }

    // additional stop check, done after an eventually reset of local data, for avoiding an always stopped tab
    if (localStorage["ncr_tab" + tab.id + "_break"]) {
        debug("STOP : we have a break stored for current tab!", changeInfo.status);
        return;
    }

    // add NCR icon?
    if ( tab.url.match(ncrComRegExp) && localStorage["ncr_checkbox_icon"] === "true" ){                                                     // if the url is on ncr format and user wants the icon displayed (ncr-19) ...
        debug("show page action for URL : " + tab.url, changeInfo.status);
        chrome.pageAction.show(tabId);                                                                                                      // show the page action (the NCR icon)
    }

    // get user inputs
    // we need to get these values each time a URL is checked, in case options are changed by the user
    checkGoogle     = (localStorage["ncr_checkbox_google"] === "true");
    checkBlogspot   = (localStorage["ncr_checkbox_blogspot"] === "true");

    debug("urlCheck(\""+tab.url+"\")", changeInfo.status);

    // we only want to process with the URL as long at is not an already .com URL
    // and if it is not a country specific google logout link
    if ( !(tab.url.match(ncrComRegExp)) && !(tab.url.match(googleLogoutRegExp)) && !(tab.url.match(bloggerBareDomain)) && !(tab.url.match(mapsTldRedirect)) ){
        for(i = 0; i < regExpUrlsToCheck.length; i++) {                                                                                     // loop through all URLs to check
            debug("regExpUrlsToCheck["+i+"] = " + regExpUrlsToCheck[i], changeInfo.status);

            if ( (tab.url.match(regExpUrlsToCheck[i])) ){                                                                                   // if we find the pattern given in our regExpUrlsToCheck
                debug("tab.url (\"" + tab.url + "\") matching regExpUrlsToCheck["+i+"] ("+ regExpUrlsToCheck[i] +")", changeInfo.status);
                newUrl = tab.url;

                if ( urlsToCheck[i].match("google") && checkGoogle ){                                                                       // google url
                    debug("google url", changeInfo.status);

                    if ( newUrl.match(googleRegExp) && !newUrl.match("books.") ){
                        debug("google url - ncr-able url", changeInfo.status);
                        newUrl = newUrl.replace(tldCcRegexp, ".com/ncr");                                                                   // if nothing is after "google.com/" and it is possible to add "/ncr" to the domain
                    } else {                                                                                                                // if URL is longer, like "google.com/?hl=en&...."
                        debug("google url - com-able url", changeInfo.status);                                                              // in these cases we can just change to .com (/ncr not needed)
                        if ( newUrl.match(googleFlightsRegExp) ){                                                                           // special case for google flights (ncr-16)
                            newUrl = newUrl.replace(tldCcRegexp, ".com/");
                            if ( newUrl.match("flights/#") ){                                                                               // longer flights urls (ncr-21)
                                newUrl = newUrl.replace("flights/#", "flights/?gl=US#");
                            } else {                                                                                                        // in this case we have a bare flight url (eg. "google.no/flights")
                                newUrl = newUrl + "?gl=US";
                            }
                        } else {
                            newUrl = newUrl.replace(tldCcRegexp, ".com/");
                        }
                    }

                } else if ( urlsToCheck[i].match("blogspot") && checkBlogspot ) {                                                           // blogspot url
                    debug("blogspot url", changeInfo.status);
                    newUrl = newUrl.replace(tldCcRegexp, ".com/ncr/");
                } else {                                                                                                                    // normally we're here if we user has set NCRify options on domain to 'false'
                    debug("NCRify is off for given domain (or we have a dead moth in the system)", changeInfo.status);
                    break;
                }

                debug("newUrl : " + newUrl, changeInfo.status);                                                                             // the new NCRified url

                // this part of the code prevents endless redirects (maps.google.com is a problematic url)
                // "number_of_redirects_before_exit" - this is the number of times we run the "for loop", where we store urls, so for example, if this number is 2, we store two urls for the tab.
                // when we store a url, we set "url_stored" to be true. so, in case we went from 1 till "number_of_redirects_before_exit", without finding any space for storing the new
                // url, then "url_stored" will be false when we exit the for loop as well. in this case we know we have a problem, so we can stop
                var url_stored = false;
                for (i = 1; i <= number_of_redirects_before_exit; i=i+1){
                    // if local storage for url #i is not used, we save the url...
                    if (localStorage["ncr_tab" + tab.id + "_url_" + i] === undefined || localStorage["ncr_tab" + tab.id + "_url_" + i] === ""){
                        // if we have stored two (or more) urls from before, we start checking that this new url is not exactly the same as the last one we stored.
                        // in most cases there should not be many urls stored doing redirects. you should have the none-NCR url, and the NCR'ified url. however the
                        // domain "maps.google.com" is creating problems.
                        // note: for this check to work "number_of_redirects_before_exit" has to be bigger than 2 (otherwise "i > 2" makes no sense)
                        if (i > 2){
                            if (localStorage["ncr_tab" + tab.id + "_url_" + (i-1)] === tab.url){
                                debug("ERROR : endless loop : new url equals old url!", tab_status_to_work_with);
                                localStorage["ncr_tab" + tab.id + "_break"] = 1;
                                return;
                            }
                        }

                        localStorage["ncr_tab" + tab.id + "_url_" + i] = tab.url;
                        url_stored = true;
                        break;
                    }
                }
                if (url_stored === false){
                    debug("ERROR : endless loop : too many redirects!", tab_status_to_work_with);
                    localStorage["ncr_tab" + tab.id + "_break"] = 1;
                    return;
                } else {
                    debug("reload tab with new url", changeInfo.status);
                    chrome.tabs.update(tab.id, {url: newUrl});
                }

            }
        }
    } else {                                                                                                                                // if we have a ncr match
        debug("DONE : url gives ncr match, or exception - we change nothing!", changeInfo.status);
    }
}


// delete local storage related to the tabs that are closed
function localStorageCleanup(tabId, removeIfo) {
    for (i = 1; i <= number_of_redirects_before_exit; i=i+1){
        localStorage.removeItem("ncr_tab" + tabId +  "_url_" + i);
    }

    localStorage.removeItem("ncr_tab" + tabId + "_break");
    localStorage.removeItem("ncr_tab" + tabId + "_timestamp");
}


// listen to any tab change, please note that this will be trigged several times on one url change, or tab reload.
// documentation: https://developer.chrome.com/extensions/tabs
chrome.tabs.onUpdated.addListener(urlCheck);


// add listener when removing a tab
chrome.tabs.onRemoved.addListener(localStorageCleanup);
