// (C) Wolfgang Huber 2010-2011

// Script parameters - these are set up by R in the function 'writeReport' when copying the 
//   template for this script from arrayQualityMetrics/inst/scripts into the report.

var highlightInitial = [ false, true, false, false, true, true, true, false, false, true, false, false, false, true, false, false, false, true, false, false ];
var arrayMetadata    = [ [ "1", "1-miRNA-015M_(miRNA-4_0).CEL", "1-miRNA-015M_(miRNA-4_0).CEL", "M", "CONTROL" ], [ "2", "10-miRNA-034F_(miRNA-4_0).CEL", "10-miRNA-034F_(miRNA-4_0).CEL", "F", "CONTROL" ], [ "3", "11-miRNA-050-M-Rehyb_(miRNA-4_0).CEL", "11-miRNA-050-M-Rehyb_(miRNA-4_0).CEL", "M", "CONTROL" ], [ "4", "12-miRNA-008-M-Rehyb_(miRNA-4_0).CEL", "12-miRNA-008-M-Rehyb_(miRNA-4_0).CEL", "M", "SAHS" ], [ "5", "13-miRNA-050-F-Rehyb_(miRNA-4_0).CEL", "13-miRNA-050-F-Rehyb_(miRNA-4_0).CEL", "F", "CONTROL" ], [ "6", "14-miRNA-008-F-Rehyb_(miRNA-4_0).CEL", "14-miRNA-008-F-Rehyb_(miRNA-4_0).CEL", "F", "SAHS" ], [ "7", "15-miRNA-054-M-Rehyb_(miRNA-4_0).CEL", "15-miRNA-054-M-Rehyb_(miRNA-4_0).CEL", "M", "CONTROL" ], [ "8", "16-miRNA-020-M-Rehyb_(miRNA-4_0).CEL", "16-miRNA-020-M-Rehyb_(miRNA-4_0).CEL", "M", "SAHS" ], [ "9", "17-miRNA-054-F-Rehyb_(miRNA-4_0).CEL", "17-miRNA-054-F-Rehyb_(miRNA-4_0).CEL", "F", "CONTROL" ], [ "10", "18-miRNA-020-F-Rehyb_(miRNA-4_0).CEL", "18-miRNA-020-F-Rehyb_(miRNA-4_0).CEL", "F", "SAHS" ], [ "11", "19-miRNA-024-M-Rehyb_(miRNA-4_0).CEL", "19-miRNA-024-M-Rehyb_(miRNA-4_0).CEL", "M", "SAHS" ], [ "12", "2-miRNA-074M_(miRNA-4_0).CEL", "2-miRNA-074M_(miRNA-4_0).CEL", "M", "SAHS" ], [ "13", "20-miRNA-024-F-Rehyb_(miRNA-4_0).CEL", "20-miRNA-024-F-Rehyb_(miRNA-4_0).CEL", "F", "SAHS" ], [ "14", "3-miRNA-015F_(miRNA-4_0).CEL", "3-miRNA-015F_(miRNA-4_0).CEL", "F", "CONTROL" ], [ "15", "4-miRNA-074F_(miRNA-4_0).CEL", "4-miRNA-074F_(miRNA-4_0).CEL", "F", "SAHS" ], [ "16", "5-miRNA-040M_(miRNA-4_0).CEL", "5-miRNA-040M_(miRNA-4_0).CEL", "M", "CONTROL" ], [ "17", "6-miRNA-060M_(miRNA-4_0).CEL", "6-miRNA-060M_(miRNA-4_0).CEL", "M", "SAHS" ], [ "18", "7-miRNA-040F_(miRNA-4_0).CEL", "7-miRNA-040F_(miRNA-4_0).CEL", "F", "CONTROL" ], [ "19", "8-miRNA-060F_(miRNA-4_0).CEL", "8-miRNA-060F_(miRNA-4_0).CEL", "F", "SAHS" ], [ "20", "9-miRNA-034M_(miRNA-4_0).CEL", "9-miRNA-034M_(miRNA-4_0).CEL", "M", "CONTROL" ] ];
var svgObjectNames   = [ "pca", "dens" ];

var cssText = ["stroke-width:1; stroke-opacity:0.4",
               "stroke-width:3; stroke-opacity:1" ];

// Global variables - these are set up below by 'reportinit'
var tables;             // array of all the associated ('tooltips') tables on the page
var checkboxes;         // the checkboxes
var ssrules;


function reportinit() 
{
 
    var a, i, status;

    /*--------find checkboxes and set them to start values------*/
    checkboxes = document.getElementsByName("ReportObjectCheckBoxes");
    if(checkboxes.length != highlightInitial.length)
	throw new Error("checkboxes.length=" + checkboxes.length + "  !=  "
                        + " highlightInitial.length="+ highlightInitial.length);
    
    /*--------find associated tables and cache their locations------*/
    tables = new Array(svgObjectNames.length);
    for(i=0; i<tables.length; i++) 
    {
        tables[i] = safeGetElementById("Tab:"+svgObjectNames[i]);
    }

    /*------- style sheet rules ---------*/
    var ss = document.styleSheets[0];
    ssrules = ss.cssRules ? ss.cssRules : ss.rules; 

    /*------- checkboxes[a] is (expected to be) of class HTMLInputElement ---*/
    for(a=0; a<checkboxes.length; a++)
    {
	checkboxes[a].checked = highlightInitial[a];
        status = checkboxes[a].checked; 
        setReportObj(a+1, status, false);
    }

}


function safeGetElementById(id)
{
    res = document.getElementById(id);
    if(res == null)
        throw new Error("Id '"+ id + "' not found.");
    return(res)
}

/*------------------------------------------------------------
   Highlighting of Report Objects 
 ---------------------------------------------------------------*/
function setReportObj(reportObjId, status, doTable)
{
    var i, j, plotObjIds, selector;

    if(doTable) {
	for(i=0; i<svgObjectNames.length; i++) {
	    showTipTable(i, reportObjId);
	} 
    }

    /* This works in Chrome 10, ssrules will be null; we use getElementsByClassName and loop over them */
    if(ssrules == null) {
	elements = document.getElementsByClassName("aqm" + reportObjId); 
	for(i=0; i<elements.length; i++) {
	    elements[i].style.cssText = cssText[0+status];
	}
    } else {
    /* This works in Firefox 4 */
    for(i=0; i<ssrules.length; i++) {
        if (ssrules[i].selectorText == (".aqm" + reportObjId)) {
		ssrules[i].style.cssText = cssText[0+status];
		break;
	    }
	}
    }

}

/*------------------------------------------------------------
   Display of the Metadata Table
  ------------------------------------------------------------*/
function showTipTable(tableIndex, reportObjId)
{
    var rows = tables[tableIndex].rows;
    var a = reportObjId - 1;

    if(rows.length != arrayMetadata[a].length)
	throw new Error("rows.length=" + rows.length+"  !=  arrayMetadata[array].length=" + arrayMetadata[a].length);

    for(i=0; i<rows.length; i++) 
 	rows[i].cells[1].innerHTML = arrayMetadata[a][i];
}

function hideTipTable(tableIndex)
{
    var rows = tables[tableIndex].rows;

    for(i=0; i<rows.length; i++) 
 	rows[i].cells[1].innerHTML = "";
}


/*------------------------------------------------------------
  From module 'name' (e.g. 'density'), find numeric index in the 
  'svgObjectNames' array.
  ------------------------------------------------------------*/
function getIndexFromName(name) 
{
    var i;
    for(i=0; i<svgObjectNames.length; i++)
        if(svgObjectNames[i] == name)
	    return i;

    throw new Error("Did not find '" + name + "'.");
}


/*------------------------------------------------------------
  SVG plot object callbacks
  ------------------------------------------------------------*/
function plotObjRespond(what, reportObjId, name)
{

    var a, i, status;

    switch(what) {
    case "show":
	i = getIndexFromName(name);
	showTipTable(i, reportObjId);
	break;
    case "hide":
	i = getIndexFromName(name);
	hideTipTable(i);
	break;
    case "click":
        a = reportObjId - 1;
	status = !checkboxes[a].checked;
	checkboxes[a].checked = status;
	setReportObj(reportObjId, status, true);
	break;
    default:
	throw new Error("Invalid 'what': "+what)
    }
}

/*------------------------------------------------------------
  checkboxes 'onchange' event
------------------------------------------------------------*/
function checkboxEvent(reportObjId)
{
    var a = reportObjId - 1;
    var status = checkboxes[a].checked;
    setReportObj(reportObjId, status, true);
}


/*------------------------------------------------------------
  toggle visibility
------------------------------------------------------------*/
function toggle(id){
  var head = safeGetElementById(id + "-h");
  var body = safeGetElementById(id + "-b");
  var hdtxt = head.innerHTML;
  var dsp;
  switch(body.style.display){
    case 'none':
      dsp = 'block';
      hdtxt = '-' + hdtxt.substr(1);
      break;
    case 'block':
      dsp = 'none';
      hdtxt = '+' + hdtxt.substr(1);
      break;
  }  
  body.style.display = dsp;
  head.innerHTML = hdtxt;
}
