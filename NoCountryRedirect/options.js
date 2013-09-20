// -----------------------------------------------------------------
// file:	options.js
// what:	JavaScript code for the options page
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

	var checkbox_google			= document.getElementById("checkbox_google");
	var checkbox_blogspot		= document.getElementById("checkbox_blogspot");

	checkbox_google.checked		= (localStorage["checkbox_google"] == "true");
	checkbox_blogspot.checked	= (localStorage["checkbox_blogspot"] == "true");
}


// -----
// when user clicks save...
// -----
function clickSave(){
	debug("clickSave()");

	var status = document.getElementById("status");

	status.innerHTML = "Options are saved!";

	var checkbox_google		= document.getElementById("checkbox_google");
	var checkbox_blogspot	= document.getElementById("checkbox_blogspot");

	localStorage["checkbox_google"]		= checkbox_google.checked;
	localStorage["checkbox_blogspot"]	= checkbox_blogspot.checked;

	debug("checkbox_google = " + localStorage["checkbox_google"] );
	debug("checkbox_blogspot = " + localStorage["checkbox_blogspot"] );
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

	document.getElementById("checkbox_google")
		.addEventListener("click", needToSave, false);
	
	document.getElementById("checkbox_blogspot")
		.addEventListener("click", needToSave, false);
	
	document.getElementById("save")
		.addEventListener("click", clickSave, false);
}, false);
