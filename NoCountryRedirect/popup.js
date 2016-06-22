// -----------------------------------------------------------------
// file:    popup.js
// what:    responsible for the magic in the popup
// started: 2016.02.06
// note:    see revisions.txt for changelog
// -----------------------------------------------------------------

// -----
// handling click on local mode link
// -----
function clickNoNcr(event) {
    //console.log("clickNoNcr()");

    // get the url of the current tab
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      var newUrl = tabs[0].url;

      if ( newUrl.match("\\?") ) {
          newUrl = newUrl + "&ncr_disabled=1";
      } else {
          newUrl = newUrl + "?ncr_disabled=1";
      }

      var preferredTld = localStorage["ncr_local_tld"];
      if ( !preferredTld.match("^\\.") ) {                      // add a dot to the tld
          preferredTld = "." + preferredTld;
      }
      newUrl = newUrl.replace(".com", preferredTld);

      chrome.tabs.create({url : newUrl});                       // create new tab using new url
    });
}


// -----
// handling click on incognito mode link
// -----
function clickNoNcrIncognito(event) {
    //console.log("clickNoNcrIncognito()");

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      var newUrl = tabs[0].url;

      if ( newUrl.match("\\?") ) {
          newUrl = newUrl + "&ncr_disabled=1";
      } else {
          newUrl = newUrl + "?ncr_disabled=1";
      }

      chrome.windows.create({url : newUrl, incognito : true});
  });

}


// -----
// adding a listener on loaded dom content
// -----
document.addEventListener('DOMContentLoaded', function () {
    // add event handlers on click
    noNcr = document.getElementById("noNcr");
    noNcr.addEventListener('click', clickNoNcr);

    noNcrIncognito = document.getElementById("noNcrIncognito");
    noNcrIncognito.addEventListener('click', clickNoNcrIncognito);

    // set correct tld in popup window
    preferredTld = document.getElementById("preferredTld");
    preferredTld.innerHTML = localStorage["ncr_local_tld"];

    // display extension status on the popup page
    ncrStatus = document.getElementById("ncrStatus");
    ncrStatus.innerHTML = localStorage["ncr_status"];



    // display local mode, or not - and present status icon
    localMode = document.getElementById("localMode");
    ncrStatusIcon = document.getElementById("ncrStatusIcon");
    ncrStatusLine = document.getElementById("ncrStatusLine");

    if (localStorage["ncr_status"] === "active") {
        localMode.style.display = "table-row";
        ncrStatusIcon.innerHTML = "&#9654;";
        ncrStatusLine.style.color = "#33cc33";
    } else {
        localMode.style.display = "none";
        ncrStatusIcon.innerHTML = "&#9632;";
        ncrStatusLine.style.color = "#ff9999";
    }

});
