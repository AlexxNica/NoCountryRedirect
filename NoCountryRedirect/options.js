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

    ncr_checkbox_google.checked     = (localStorage["ncr_checkbox_google"] == "true");
    ncr_checkbox_blogspot.checked   = (localStorage["ncr_checkbox_blogspot"] == "true");
}


// -----
// when user clicks save...
// -----
function clickSave(){
    debug("clickSave()");

    var status = document.getElementById("status");

    status.innerHTML = "Options are saved!";

    var ncr_checkbox_google     = document.getElementById("ncr_checkbox_google");
    var ncr_checkbox_blogspot   = document.getElementById("ncr_checkbox_blogspot");

    localStorage["ncr_checkbox_google"]     = ncr_checkbox_google.checked;
    localStorage["ncr_checkbox_blogspot"]   = ncr_checkbox_blogspot.checked;

    debug("ncr_checkbox_google = " + localStorage["ncr_checkbox_google"] );
    debug("ncr_checkbox_blogspot = " + localStorage["ncr_checkbox_blogspot"] );
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
// adding listeners
// -----
window.addEventListener("load", function()
{
    restoreOptions();

    document.getElementById("ncr_checkbox_google")
        .addEventListener("click", needToSave, false);

    document.getElementById("ncr_checkbox_blogspot")
        .addEventListener("click", needToSave, false);

    document.getElementById("save")
        .addEventListener("click", clickSave, false);
}, false);
