// -----------------------------------------------------------------
// file:    options.js
// what:    JavaScript code for the options page
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
    var ncr_local_tld               = document.getElementById("ncr_local_tld");
    var ncr_whitelist_1             = document.getElementById("ncr_whitelist_1");
    var ncr_whitelist_2             = document.getElementById("ncr_whitelist_2");
    var ncr_whitelist_3             = document.getElementById("ncr_whitelist_3");
    var ncr_whitelist_4             = document.getElementById("ncr_whitelist_4");
    var ncr_whitelist_5             = document.getElementById("ncr_whitelist_5");
    var ncr_whitelist_6             = document.getElementById("ncr_whitelist_6");
    var ncr_whitelist_7             = document.getElementById("ncr_whitelist_7");
    var ncr_whitelist_8             = document.getElementById("ncr_whitelist_8");
    var ncr_whitelist_9             = document.getElementById("ncr_whitelist_9");
    var ncr_whitelist_10            = document.getElementById("ncr_whitelist_10");

    ncr_checkbox_google.checked     = (localStorage["ncr_checkbox_google"] === "true");
    ncr_checkbox_blogspot.checked   = (localStorage["ncr_checkbox_blogspot"] === "true");
    ncr_local_tld.value             = localStorage["ncr_local_tld"];
    ncr_whitelist_1.value           = localStorage["ncr_whitelist_1"]
    ncr_whitelist_2.value           = localStorage["ncr_whitelist_2"]
    ncr_whitelist_3.value           = localStorage["ncr_whitelist_3"]
    ncr_whitelist_4.value           = localStorage["ncr_whitelist_4"]
    ncr_whitelist_5.value           = localStorage["ncr_whitelist_5"]
    ncr_whitelist_6.value           = localStorage["ncr_whitelist_6"]
    ncr_whitelist_7.value           = localStorage["ncr_whitelist_7"]
    ncr_whitelist_8.value           = localStorage["ncr_whitelist_8"]
    ncr_whitelist_9.value           = localStorage["ncr_whitelist_9"]
    ncr_whitelist_10.value          = localStorage["ncr_whitelist_10"]
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
    var ncr_local_tld                       = document.getElementById("ncr_local_tld");
    var ncr_whitelist_1                     = document.getElementById("ncr_whitelist_1");
    var ncr_whitelist_2                     = document.getElementById("ncr_whitelist_2");
    var ncr_whitelist_3                     = document.getElementById("ncr_whitelist_3");
    var ncr_whitelist_4                     = document.getElementById("ncr_whitelist_4");
    var ncr_whitelist_5                     = document.getElementById("ncr_whitelist_5");
    var ncr_whitelist_6                     = document.getElementById("ncr_whitelist_6");
    var ncr_whitelist_7                     = document.getElementById("ncr_whitelist_7");
    var ncr_whitelist_8                     = document.getElementById("ncr_whitelist_8");
    var ncr_whitelist_9                     = document.getElementById("ncr_whitelist_9");
    var ncr_whitelist_10                    = document.getElementById("ncr_whitelist_10");

    localStorage["ncr_checkbox_google"]     = ncr_checkbox_google.checked;
    localStorage["ncr_checkbox_blogspot"]   = ncr_checkbox_blogspot.checked;
    localStorage["ncr_local_tld"]           = ncr_local_tld.value.replace(/ /g,'').replace(/^\.+/g,'');
    localStorage["ncr_whitelist_1"]         = ncr_whitelist_1.value.replace(/ /g,'');
    localStorage["ncr_whitelist_2"]         = ncr_whitelist_2.value.replace(/ /g,'');
    localStorage["ncr_whitelist_3"]         = ncr_whitelist_3.value.replace(/ /g,'');
    localStorage["ncr_whitelist_4"]         = ncr_whitelist_4.value.replace(/ /g,'');
    localStorage["ncr_whitelist_5"]         = ncr_whitelist_5.value.replace(/ /g,'');
    localStorage["ncr_whitelist_6"]         = ncr_whitelist_6.value.replace(/ /g,'');
    localStorage["ncr_whitelist_7"]         = ncr_whitelist_7.value.replace(/ /g,'');
    localStorage["ncr_whitelist_8"]         = ncr_whitelist_8.value.replace(/ /g,'');
    localStorage["ncr_whitelist_9"]         = ncr_whitelist_9.value.replace(/ /g,'');
    localStorage["ncr_whitelist_10"]        = ncr_whitelist_10.value.replace(/ /g,'');

    debug("ncr_checkbox_google = " + localStorage["ncr_checkbox_google"] );
    debug("ncr_checkbox_blogspot = " + localStorage["ncr_checkbox_blogspot"] );
    debug("ncr_local_tld = " + localStorage["ncr_local_tld"] );
    debug("ncr_whitelist_1 = " + localStorage["ncr_whitelist_1"] );
    debug("ncr_whitelist_2 = " + localStorage["ncr_whitelist_2"] );
    debug("ncr_whitelist_3 = " + localStorage["ncr_whitelist_3"] );
    debug("ncr_whitelist_4 = " + localStorage["ncr_whitelist_4"] );
    debug("ncr_whitelist_5 = " + localStorage["ncr_whitelist_5"] );
    debug("ncr_whitelist_6 = " + localStorage["ncr_whitelist_6"] );
    debug("ncr_whitelist_7 = " + localStorage["ncr_whitelist_7"] );
    debug("ncr_whitelist_8 = " + localStorage["ncr_whitelist_8"] );
    debug("ncr_whitelist_9 = " + localStorage["ncr_whitelist_9"] );
    debug("ncr_whitelist_10 = " + localStorage["ncr_whitelist_10"] );
}


// -----
// sets a flag to inform saving is needed
// -----
function needToSave(){
    debug("needToSave()");

    var status = document.getElementById("status");
    status.innerHTML = "&nbsp; Click 'Save' to apply changes! &nbsp;";
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

    document.getElementById("ncr_local_tld")
            .addEventListener("click", needToSave, false);

    document.getElementById("ncr_whitelist_1")
        .addEventListener("change", needToSave, false);

    document.getElementById("ncr_whitelist_2")
        .addEventListener("change", needToSave, false);

    document.getElementById("ncr_whitelist_3")
        .addEventListener("change", needToSave, false);

    document.getElementById("ncr_whitelist_4")
        .addEventListener("change", needToSave, false);

    document.getElementById("ncr_whitelist_5")
        .addEventListener("change", needToSave, false);

    document.getElementById("ncr_whitelist_6")
        .addEventListener("change", needToSave, false);

    document.getElementById("ncr_whitelist_7")
        .addEventListener("change", needToSave, false);

    document.getElementById("ncr_whitelist_8")
        .addEventListener("change", needToSave, false);

    document.getElementById("ncr_whitelist_9")
        .addEventListener("change", needToSave, false);

    document.getElementById("ncr_whitelist_10")
        .addEventListener("change", needToSave, false);

    document.getElementById("save")
        .addEventListener("click", clickSave, false);

    document.getElementById("clear_storage")
        .addEventListener("click", clearStorage, false);

}, false);
