// -----------------------------------------------------------------
// file:    options.js
// what:    JavaScript code for the options page
// started: 2012.08.xx (first version finished 2013.03.27)
// -----------------------------------------------------------------


// -----
// simple function that prints debugging messages
// -----
function debug(message){
    var doDebug = false;

    if (doDebug){
        console.log("DEBUG : " + message);
    }
}


// -----
// restores saved options from local storage
// -----
function restoreOptions(){
    debug("restoreOptions()");

    var ncr_checkbox_google         = document.getElementById("ncr_checkbox_google");
    var ncr_checkbox_blogspot       = document.getElementById("ncr_checkbox_blogspot");
    var ncr_whitelist_1             = document.getElementById("ncr_whitelist_1");
    var ncr_whitelist_2             = document.getElementById("ncr_whitelist_2");
    var ncr_whitelist_3             = document.getElementById("ncr_whitelist_3");

    ncr_checkbox_google.checked     = (localStorage["ncr_checkbox_google"] === "true");
    ncr_checkbox_blogspot.checked   = (localStorage["ncr_checkbox_blogspot"] === "true");
    ncr_whitelist_1.value           = localStorage["ncr_whitelist_1"]
    ncr_whitelist_2.value           = localStorage["ncr_whitelist_2"]
    ncr_whitelist_3.value           = localStorage["ncr_whitelist_3"]
}


// -----
// when user clicks save...
// -----
function clickSave(){
    debug("clickSave()");

    var status = document.getElementById("status");

    status.innerHTML = "Options are saved!";

    var ncr_checkbox_google                 = document.getElementById("ncr_checkbox_google");
    var ncr_checkbox_blogspot               = document.getElementById("ncr_checkbox_blogspot");
    var ncr_whitelist_1                     = document.getElementById("ncr_whitelist_1");
    var ncr_whitelist_2                     = document.getElementById("ncr_whitelist_2");
    var ncr_whitelist_3                     = document.getElementById("ncr_whitelist_3");

    localStorage["ncr_checkbox_google"]     = ncr_checkbox_google.checked;
    localStorage["ncr_checkbox_blogspot"]   = ncr_checkbox_blogspot.checked;
    localStorage["ncr_whitelist_1"]         = ncr_whitelist_1.value;
    localStorage["ncr_whitelist_2"]         = ncr_whitelist_2.value;
    localStorage["ncr_whitelist_3"]         = ncr_whitelist_3.value;

    debug("ncr_checkbox_google = " + localStorage["ncr_checkbox_google"] );
    debug("ncr_checkbox_blogspot = " + localStorage["ncr_checkbox_blogspot"] );
    debug("ncr_whitelist_1 = " + localStorage["ncr_whitelist_1"] );
    debug("ncr_whitelist_2 = " + localStorage["ncr_whitelist_2"] );
    debug("ncr_whitelist_3 = " + localStorage["ncr_whitelist_3"] );
}


// -----
// sets a flag to inform saving is needed
// -----
function needToSave(){
    debug("needToSave()");

    var status = document.getElementById("status");
    status.innerHTML = "Click 'Save' to apply changes!";
}


// -----
// clears browsing related data from local storage
// -----
function clearStorage(){
    debug("clearStorage()");

    Object.keys(localStorage)
      .forEach(function(key){
           if (/^(ncr_tab)/.test(key)) {
               localStorage.removeItem(key);
           }
        });
}


// -----
// adding listeners
// -----
window.addEventListener("load", function()
{
    restoreOptions();

    document.getElementById("ncr_checkbox_google")
        .addEventListener("click", needToSave, false);

    document.getElementById("ncr_checkbox_blogspot")
        .addEventListener("click", needToSave, false);

    document.getElementById("ncr_whitelist_1")
        .addEventListener("change", needToSave, false);

    document.getElementById("ncr_whitelist_2")
        .addEventListener("change", needToSave, false);

    document.getElementById("ncr_whitelist_3")
        .addEventListener("change", needToSave, false);

    document.getElementById("save")
        .addEventListener("click", clickSave, false);

    document.getElementById("clear_storage")
        .addEventListener("click", clearStorage, false);

}, false);
