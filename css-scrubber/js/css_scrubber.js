function reinitializeAutoUpdateListenerAndTabCapture()
{
	// SOURCE:  http://stackoverflow.com/questions/2823733/textarea-onchange-detection
	
	// update preview window as user types.
	var area = document.getElementById('scrubberTextInputID');
	if (area.addEventListener) 
	{
		// event handling code for sane browsers
		area.addEventListener('input', function() {
			autoUpdatePreview();
		}, false);
		
		//area.addEventListener("select", function() { setVerboseSelectionIndex(); }, false);
	}
	else if (area.attachEvent) 
	{
		// IE-specific event handling code
		area.attachEvent('onpropertychange', function() {
			autoUpdatePreview();
		});
		
		//area.attachEvent("select", function() { setVerboseSelectionIndex();	}, false);
	}
	
	
	
	/*
	// Scroll down during resize;
	$("#scrubberTextInputID").resizable({
		handles: "se",
		resize: function()
		{
			$("body").scrollTo( '+=1px', 0 );
		}
	});
	*/
	

	// capture tab key in textarea.
	//SOURCE:  http://stackoverflow.com/questions/6140632/how-to-handle-tab-in-textarea
	$(document).delegate('#scrubberTextInputID', 'keydown', function(e) 
	{
		var keyCode = e.keyCode || e.which;
		
		//alert(keyCode); // for testing new keys.
		
		if (keyCode == 9) // tab
		{
			e.preventDefault();
			var start = $(this).get(0).selectionStart;
			var end = $(this).get(0).selectionEnd;
				
			if (event.shiftKey) // shift+tab
			{	
				
				if ($(this).val().substring(start-1, start) == "\t")
				{
					// set textarea value to: text before caret + tab + text after caret
					$(this).val($(this).val().substring(0, start-1)
					+ $(this).val().substring(start)); 

					// put caret at right position again
					$(this).get(0).selectionStart = start - 1;
					$(this).get(0).selectionEnd = end - 1;
					
					end--;
				}
				else if ($(this).val().substring(start, start+1) == "\t")
				{
					// set textarea value to: text before caret + tab + text after caret
					$(this).val($(this).val().substring(0, start)
					+ $(this).val().substring(start+1)); 

					// put caret at right position again
					$(this).get(0).selectionStart = start - 1;
					$(this).get(0).selectionEnd = end - 1;
					
					end--;
				}
				
				
				
				// add a tab to all newlines in selection
				var numberOfNewLines = ($(this).val().substring(start, end).match(/\n\t/g)||[]).length;
				if (numberOfNewLines > 0)
				{
					var tabSelection = $(this).val().substring(0, start);
					tabSelection += $(this).val().substring(start, end).replace(/\n\t/g, "\n" );
					tabSelection += $(this).val().substring(end);
					$(this).val(tabSelection);
					
					// put caret at right position again
					$(this).get(0).selectionStart = start - 1;
					$(this).get(0).selectionEnd = end - numberOfNewLines;
				}
				
			}
			else
			{
				
				// set textarea value to: text before caret + tab + text after caret
				// Will tab without deleting the selected text.
				$(this).val($(this).val().substring(0, start)
				+ "\t"
				+ $(this).val().substring(start));

				// put caret at right position again
				$(this).get(0).selectionStart = start + 1;
				$(this).get(0).selectionEnd = end + 1;
				
				
				
				// add a tab to all newlines in selection
				var numberOfNewLines = ($(this).val().substring(start, end).match(/\n/g)||[]).length;
				if (numberOfNewLines > 0)
				{
					var tabSelection = $(this).val().substring(0, start);
					tabSelection += $(this).val().substring(start, end).replace(/\n/g, "\n\t" );
					tabSelection += $(this).val().substring(end);
					$(this).val(tabSelection);
					
					// put caret at right position again
					$(this).get(0).selectionStart = start + 1;
					$(this).get(0).selectionEnd = end + 1 + numberOfNewLines;
				}
				
			}
		}
		
		if (keyCode == 13) // enter
		{
			e.preventDefault();
			var start = $(this).get(0).selectionStart;
			var end = $(this).get(0).selectionEnd;
			// count the number of '\t' chars between the cursor and the last newline, or the beginning of the file.
			
			var startOfLine = $(this).val().substring(0, start).lastIndexOf('\n');
			if (startOfLine == -1) startOfLine = 0;
			var numberOfTabs = ($(this).val().substring(startOfLine, start).match(/\t/g)||[]).length;
			//alert(numberOfTabs);
			var newLineE = $(this).val().substring(0, start) + '\n';
			var i = 0;
			while (i++ < numberOfTabs) newLineE += '\t';
			newLineE += $(this).val().substring(end);
			$(this).val(newLineE)
			
			// put caret at right position again
			$(this).get(0).selectionEnd = $(this).get(0).selectionStart = start + numberOfTabs + 1;
		}
		
		
		if (keyCode == 36) // home
		{
			//e.preventDefault();
			var start = $(this).get(0).selectionStart;
			var end = $(this).get(0).selectionEnd;
			
			if ($(this).val().substring(start-1, start) != "\t" && $(this).val().substring(start-1, start) != "\n")
			{
				//console.log('home: 1');
				e.preventDefault();
				var lastTabIndex = $(this).val().substring(0, start).lastIndexOf('\t') + 1; // this also can handle the default at the start of the file?
				var lastNewLineIndex = $(this).val().substring(0, start).lastIndexOf('\n') + 1;
				
				if (lastNewLineIndex > lastTabIndex) lastTabIndex = lastNewLineIndex;
				
				$(this).get(0).selectionStart = lastTabIndex;
				// shift+home
				if (event.shiftKey) $(this).get(0).selectionEnd = end;
				else $(this).get(0).selectionEnd = lastTabIndex;
			}
			else if ($(this).val().substring(start, start+1) == "\t" && $(this).val().substring(start-1, start) == "\n")
			{
				//console.log('home: 2');
				e.preventDefault();
				while ($(this).val().substring(start, start+1) == "\t") start++;
				
				// is there a better way to swap these, or reverse them so end is positioned before start?
				if (start > end && event.shiftKey)
				{
					var tempStart = start;
					start = end;
					end = tempStart;
				}
				
				// shift+home
				$(this).get(0).selectionStart = start;
				if (event.shiftKey) $(this).get(0).selectionEnd = end;
				else $(this).get(0).selectionEnd = start;
				
			}
			else if ($(this).val().substring(start-1, start) == "\n")
			{
				//console.log('home: 3');
				e.preventDefault();
			}
			// else: go to home (default functionality).
			/*
			else 
			{
				console.log('home: default');
				
				e.preventDefault();
				var lastNewLineIndex = $(this).val().substring(0, start).lastIndexOf('\n') + 1;
				
				$(this).get(0).selectionStart = lastNewLineIndex;
				// shift+home
				if (event.shiftKey) $(this).get(0).selectionEnd = end;
				else $(this).get(0).selectionEnd = lastNewLineIndex;
			}
			*/
		}
		
		
		if (keyCode == 8) // backspace
		{
			if (document.getElementById('editorAutoBeautify').checked)
			{
				var start = $(this).get(0).selectionStart;
				var end = $(this).get(0).selectionEnd;
				// count the number of '\t' chars between the cursor and the last newline, or the beginning of the file.
				
				if ($(this).val().substring(start-1, start) == '\t' || $(this).val().substring(start-1, start) == '\n')
				{
					e.preventDefault();
					
					//var startOfLine = $(this).val().substring(start-1, start);
					//var startOfLine = $(this).val().substring(0, start).lastIndexOf('\n');
					//if (startOfLine == -1) startOfLine = 0;
					
					while ($(this).val().substring(start-1, start) == '\t' || $(this).val().substring(start-1, start) == '\n') start--;
					$(this).val($(this).val().substring(0, start) + $(this).val().substring(end))
					
					// put caret at right position again
					$(this).get(0).selectionEnd = $(this).get(0).selectionStart = start;
				}
			}
		}
		
		
		if (document.getElementById('editorAutoBeautify').checked)
		{
			/*
			// "<" open tag
			if (e.keyCode == 188 && event.shiftKey)
			{
				//alert("<");
				var start = $(this).get(0).selectionStart;
				var end = $(this).get(0).selectionEnd;
				
				var newHTML = $(this).val().substring(0, start) + ">" + $(this).val().substring(end);
				$(this).val(newHTML);
				
				document.getElementById('scrubberTextInputID').selectionStart = start;
				document.getElementById('scrubberTextInputID').selectionEnd = end;
			}
			*/
			
			
			// ">" close tag
			if (e.keyCode == 190 && event.shiftKey)
			{
				if (document.getElementById('editorAutoBeautify').checked && document.getElementById('editorAutoComplete').checked)
				{
					e.preventDefault();
					
					var start = $(this).get(0).selectionStart;
					var end = $(this).get(0).selectionEnd;
					
					if (!checkForCompleteTags($(this).val()))
					{
						var endTag = $(this).val().substring($(this).val().substring(0, start).lastIndexOf("<")+1, start);
						var endOfStartTag = endTag.length;
						if (endTag.indexOf(" ") > -1 && endTag.indexOf(" ") < endTag.length) endOfStartTag = endTag.indexOf(" ");
						endTag = endTag.substring(0, endOfStartTag);
						
						// exceptions.
						if (endTag == "br" || endTag == "a" || endTag == "em" || endTag == "img" || endTag == "input" || endTag == "link")
							endTag = ">";
						else
							endTag = "></" + endTag + ">";
					}
					else var endTag = ">";
						
					var newHTML = $(this).val().substring(0, start) + endTag + $(this).val().substring(end);
					$(this).val(newHTML);
					
					document.getElementById('scrubberTextInputID').selectionStart = start+1;
					document.getElementById('scrubberTextInputID').selectionEnd = start+1;
					
					autoUpdatePreview();
				}
			}
		}
		
		
		// on paste (ctrl+v)
		if (e.keyCode == 86 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) 
		{
			autoUpdatePreview();
			
			/*
			window.setTimeout(function() 
			{
				// If all tags are complete, just update preview screen. If the number of '<' and '>' tags are unequal, fix this first.
				if (document.getElementById('scrubberTextInputID').value.split("<").length == document.getElementById('scrubberTextInputID').value.split(">").length)
				{
					autoUpdatePreview();
				}
				else
				{
					console.log('The number of "<" and ">" characters in this HTML document are inequal, so updates will be limited until this is fixed.');
					updatePreviewWithoutScrubbingCSS();
				}
			}, 0);
			*/
		}
		
		
		// on save (ctrl+s)
		if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) 
		{
			var start = $(this).get(0).selectionStart;
			var end = $(this).get(0).selectionEnd;
			
			// Set the HTML of THIS page to their stuff, then allow them to save.
			var oldHTML = $("html").html();
			var newHTML = document.getElementById('scrubberTextInputID').value;
			
			if (($(this).val().match(/(<title>)/)||[]).length >= 1) 
				$("html").html(newHTML);
			else 
				$("html").html("<title>My_Scrubbed_Page</title>" + newHTML);
			
			window.setTimeout(function() {
				alert("Thank you for using the CSS Scrubber! If you experience issues saving, please try CLICKING the Save button instead of hitting the Enter key on your keyboard.");
				$("html").html(oldHTML);
				document.getElementById('scrubberTextInputID').value = newHTML;
				document.getElementById('scrubberTextInputID').selectionStart = start;
				document.getElementById('scrubberTextInputID').selectionEnd = end;
				autoUpdatePreview();
			},0);
			
			// Or, stop them from doing this.
			//e.preventDefault(); alert('This application cannot save your work. Please copy your code into your favorite text-editor and save it as an .html file.');
		}
		
		
	});
}
reinitializeAutoUpdateListenerAndTabCapture();


function showHideAutoCompleteOption()
{
	if (document.getElementById('editorAutoBeautify').checked)
		document.getElementById('editorAutoCompleteLabel').style.visibility = "visible";
	else
		document.getElementById('editorAutoCompleteLabel').style.visibility = "hidden";
}
showHideAutoCompleteOption();


// choose whether to wrap text in textarea.
// SOURCE:  http://stackoverflow.com/questions/263938/changing-textarea-wrapping-using-javascript
function setWrap() 
{
	var myCurrentValue = document.getElementById('scrubberTextInputID').value;
	var start = $('#scrubberTextInputID').get(0).selectionStart;
	var end = $('#scrubberTextInputID').get(0).selectionEnd;
	if (document.getElementById('scrubberTextWrap').checked)
	{
		document.getElementById('scrubberTextInputID').outerHTML = '<textarea id="scrubberTextInputID" placeholder="Paste your HTML code here!"></textarea>';
	}
	else
	{
		document.getElementById('scrubberTextInputID').outerHTML = '<textarea id="scrubberTextInputID" wrap="off" placeholder="Paste your HTML code here!"></textarea>';
	}
	document.getElementById('scrubberTextInputID').value = myCurrentValue;
	$('#scrubberTextInputID').get(0).selectionStart = start;
	$('#scrubberTextInputID').get(0).selectionEnd = end;
	reinitializeAutoUpdateListenerAndTabCapture();
}


function setVerboseSelectionIndex()
{
	var newHTML = document.getElementById('scrubberTextInputID').value;
	var selectStart = $('#scrubberTextInputID').get(0).selectionEnd - 1;
	var selectedLineNumber = 0;
	if (newHTML.substring(0, selectStart).match(/\n/g)) selectedLineNumber = newHTML.substring(0, selectStart).match(/\n/g).length;
	selectStart = selectStart - newHTML.substring(0, selectStart).lastIndexOf("\n");
	document.getElementById("lineSelectionID").innerHTML = selectedLineNumber + ":" + selectStart;
}


function removeLastUnfinishedTag(newHTML, selectionIndex) 
{ 
	if (newHTML.substring(0, selectionIndex).lastIndexOf("<") > newHTML.substring(0, selectionIndex).lastIndexOf(">"))
		return newHTML.substring(0, newHTML.substring(0, selectionIndex).lastIndexOf("<")) + newHTML.substring(selectionIndex); 
	else
		return newHTML;
}


function checkForCompleteTags(newHTML)
{
	newHTML = newHTML.replace(/<script[^>]*>([\s\S]*?)<\/script\>/g, function(v){ return ''; } );
	if (newHTML.split("<").length == newHTML.split(">").length)
		return true;
	else
		return false;
}

var tagFinishTimeout;
function autoUpdatePreview()
{
	setVerboseSelectionIndex();

	//if (document.getElementById('scrubberAutoUpdate').checked && document.getElementById('scrubberTextInputID').value.split("<").length == document.getElementById('scrubberTextInputID').value.split(">").length)
	if (document.getElementById('scrubberAutoUpdate').checked)
	{
		clearTimeout(tagFinishTimeout);
		
		var newHTML = document.getElementById('scrubberTextInputID').value;
		if (newHTML == "") 
		{
			newHTML = '<div style="color:grey; text-align:center; line-height:280px;">Preview changes to your HTML here!</div>';
			$("#inequalTagsNotice").css("visibility", "hidden");
		}
		else
		{
			if (document.getElementById('editorAutoBeautify').checked)
			{
				// AUTO-PRETTY AS YOU GO !!! (user loses control over indentation)
				//=========================
				if (document.getElementById('scrubberAutoUpdate').checked && checkForCompleteTags(newHTML))
				{
					var start = $('#scrubberTextInputID').get(0).selectionStart;
					var end = $('#scrubberTextInputID').get(0).selectionEnd;
					
					var wholeText = beautifyEditorHTMLformat(newHTML.substring(0, start) + '|%$#@!|' + newHTML.substring(end));
					var newStart = wholeText.lastIndexOf('|%$#@!|');
					wholeText = wholeText.substring(0, newStart) + wholeText.substring(newStart+7);
					//wholeText.replace(/|&|/g, "" );
					$('#scrubberTextInputID').val(wholeText);
					
					$('#scrubberTextInputID').get(0).selectionStart = $('#scrubberTextInputID').get(0).selectionEnd = newStart; //firstHalf.length;
					newHTML = document.getElementById('scrubberTextInputID').value; // !!!
				}
				//=========================
			}
			
			
			if (document.getElementById('scrubberAutoUpdate').checked && !checkForCompleteTags(newHTML))
			{
				var indexOfUnfinished = 0;
				if (newHTML.match(/<[^>]*</)) var indexOfUnfinished = newHTML.match(/<[^>]*</).index - 1;
				if (indexOfUnfinished < 0) if (newHTML.match(/>[^<]*>/)) indexOfUnfinished = newHTML.match(/>[^<]*>/).index - 1;
				var lineNumber = 0;
				if (newHTML.substring(0, indexOfUnfinished).match(/\n/g)) lineNumber = newHTML.substring(0, indexOfUnfinished).match(/\n/g).length;
				indexOfUnfinished = indexOfUnfinished - newHTML.substring(0, indexOfUnfinished).lastIndexOf("\n");
				document.getElementById("unfinishedIndexID").innerHTML = "line " + lineNumber + ":" + indexOfUnfinished;
				tagFinishTimeout = setTimeout(function() { $("#inequalTagsNotice").css("visibility", "visible"); }, 2000);
				
				
				// REMOVE LAST UNFINISHED TAG BEFORE UPDATING
				//var start = $('#scrubberTextInputID').get(0).selectionStart;
				var end = $('#scrubberTextInputID').get(0).selectionEnd;
				newHTML = removeLastUnfinishedTag(newHTML, end);
			}
			else
				$("#inequalTagsNotice").css("visibility", "hidden");
				
			
			// Remove Javascript when auto-updating so scripts don't break before you finish TYPING them.
			newHTML = newHTML.replace(/<script[^>]*>([\s\S]*?)<\/script\>/g, function(v){ return ''; } );
		}
		updatePreviewHTML(newHTML);
	}
	//else
	//	$("#inequalTagsNotice").css("visibility", "hidden");
}
autoUpdatePreview();


// Set preview window iFrame to target a javascript object containing our HTML.
function updatePreviewHTML(newHTML)
{
	// Set preview window iFrame to target a javascript object containing our HTML.
	var targetP = $('#scrubberOutputFrame')[0].contentWindow.document;
	targetP.open();
	targetP.close();
	$('body',targetP).append(newHTML);
	
	// Reset height of iFrame before setting it to the height of the page, or it will never resize to become SMALLER.
	//$('#scrubberOutputFrame').height("379px");
	//$('#scrubberOutputFrame').height($('body',targetP).height() + 40);
	$('#scrubberOutputFrame').height("300px");
	$('#scrubberOutputFrame').height($('body',targetP).height() + 30);
}
$('#scrubberOutputFrame').height("300px");


function beautifyEditor()
{
	document.getElementById('scrubberTextInputID').value = beautifyEditorHTMLformat(document.getElementById('scrubberTextInputID').value);
}	

function updatePreviewWithoutScrubbingCSS()
{
	var documentWithCSS = document.createElement("html");
	documentWithCSS.innerHTML = document.getElementById('scrubberTextInputID').value;
	
	var newHTML = documentWithCSS.innerHTML;
	newHTML = beautifyEditorHTMLformat(newHTML);

	document.getElementById('scrubberTextInputID').value = newHTML;
	
	// blot out any dangerous script elements here?
	
	updatePreviewHTML(newHTML);
}	


// Add newlines in the editor window to make the HTML more readable.
function beautifyEditorHTMLformat(newHTML)
{
	/*
	// ALT-METHOD, NOT REALLY MORE EFFICIENT, REALLY.
	newHTML = newHTML.replace(/\n|\t/g, "" ); // clear out all newlines and tabs before adding our own.
	
	// Remove commented sections so there is no confusion.
	var htmlCommentArray = Array();
	newHTML = newHTML.replace(/\<!-.*?->/g, function(v){ return createCommentPlaceholder(v, htmlCommentArray, '|!-^%&|'); } ); // sorta works if all on one line;
	// Do not format content between <style> or <script> tags the same way as the HTML tags.
	var cssArray = Array();
	newHTML = newHTML.replace(/<style[^>]*>([\s\S]*?)<\/style>/g, function(v){ return createPlaceholder(v, cssArray, '|&*()_|'); } );
	var scriptArray = Array();
	newHTML = newHTML.replace(/<script[^>]*>([\s\S]*?)<\/script\>/g, function(v){ return createPlaceholder(v, scriptArray, '|&&**_|'); } );
	
	var vArray = newHTML.split(/(<.*?>)/); // Split on page elements.		
	var tabLine = "";
	newHTML = "";
	var indentLevel = 0;
	var firstrun = false;
	for (var i = 0; i < vArray.length; i++)
	{
		if (vArray[i] != "" && vArray[i] != null)
		{
			if (vArray[i] != "<strong>" && vArray[i] != "</strong>" && vArray[i].substring(0, 3) != "<a " && vArray[i] != "</a>" && vArray[i] != "<i>" && vArray[i] != "</i>" && vArray[i] != "<em>" && vArray[i] != "</em>" && vArray[i].substring(0, 5) != "<img " && vArray[i].substring(0, 7) != "<input " && vArray[i].substring(0, 6) != "<link ")
			{
				if (vArray[i].length > 1 && vArray[i].substring(0,2) == "</") indentLevel--;
					if (firstrun) tabLine = "\n"; // only add newline after first line.
					for (var j = 0; j < indentLevel; j++) tabLine += "\t";
					firstrun = true;
				//if (vArray[i] != "<strong>" && vArray[i] != "</strong>" && vArray[i].substring(0, 3) != "<a " && vArray[i] != "</a>" && vArray[i] != "<i>" && vArray[i] != "</i>" && vArray[i] != "<em>" && vArray[i] != "</em>" && vArray[i].substring(0, 5) != "<img " && vArray[i].substring(0, 7) != "<input " && vArray[i].substring(0, 6) != "<link ")
					if (vArray[i] != "<br>" && vArray[i] != "<!DOCTYPE HTML>")
						if (vArray[i].length > 1 && vArray[i].substring(0,1) == "<" && vArray[i].substring(0,2) != "</") indentLevel++;
			
				newHTML += tabLine + vArray[i];
			}
			else newHTML += vArray[i];
		}
	}
	
	// and now for some final cleanup.
	newHTML = newHTML.replace(/\n*\n/g, "\n" );
	newHTML = newHTML.replace(/\n\t*\n/g, "\n" );
	
	// Put content between <style>, <script>, and comment tags back.
	var cssArrayIndex = 0;
	newHTML = newHTML.replace(/\|\&\*\(\)\_\|/g, function(v){ return retrievePlaceHolderCSS(cssArray, cssArrayIndex++, '|&*()_|', newHTML); } );
	var scriptArrayIndex = 0;
	newHTML = newHTML.replace(/\|\&\&\*\*\_\|/g, function(v){ return retrievePlaceHolderCSS(scriptArray, scriptArrayIndex++, '|&&**_|', newHTML); } );
	var htmlCommentArrayIndex = 0;
	newHTML = newHTML.replace(/\|\!\-\^\%\&\|/g, function(v){ return retrievePlaceHolder(htmlCommentArray, htmlCommentArrayIndex++, '|!-^%&|', newHTML).replace(/\n|\t/g, "" ); } );		
	
	return newHTML;
	*/
	
	
	
	
	newHTML = newHTML.replace(/\n|\t/g, "" ); // clear out all newlines and tabs before adding our own.
	
	// Remove commented sections so there is no confusion.
	var htmlCommentArray = Array();
	newHTML = newHTML.replace(/\<!-.*?->/g, function(v){ return createCommentPlaceholder(v, htmlCommentArray, '|!-^%&|'); } ); // sorta works if all on one line;
	// Do not format content between <style> or <script> tags the same way as the HTML tags.
	var cssArray = Array();
	newHTML = newHTML.replace(/<style[^>]*>([\s\S]*?)<\/style>/g, function(v){ return createPlaceholder(v, cssArray, '|&*()_|'); } );
	var scriptArray = Array();
	newHTML = newHTML.replace(/<script[^>]*>([\s\S]*?)<\/script\>/g, function(v){ return createPlaceholder(v, scriptArray, '|&&**_|'); } );

	var firstrun = false;
	if (newHTML.substring(0, 1) != "<") firstrun = true;
	var indentLevel = 0;
	function setIndentLevel(v)
	{
		var vn = "";
		if (firstrun) vn = "\n"; // only add newline after first line.
		firstrun = true;
		
		if (v == "<strong>" || v == "</strong>" || v.substring(0, 3) == "<a " || v == "</a>" || v == "<i>" || v == "</i>" || v == "<em>" || v == "</em>" || v.substring(0, 5) == "<img " || v.substring(0, 7) == "<input " || v.substring(0, 6) == "<link ") // inline exceptions.
		{
			vn = v;
		}
		else
		{
			if (v == "<br>" || v == "<!DOCTYPE HTML>" || v.substring(0, 6) == "<meta "  || v.substring(0, 6) == "<base ")
			{
				for (var i = 0; i < indentLevel; i++) vn += "\t";
			}
			else if (v[1] == "/") // || v == "-\->") //  || v == "<!-\-"
			{
				indentLevel--;
				for (var i = 0; i < indentLevel; i++) vn += "\t";
			}
			else
			{
				for (var i = 0; i < indentLevel; i++) vn += "\t";
				indentLevel++;
			}
			vn += v + "\n";
			for (var i = 0; i < indentLevel; i++) vn += "\t";
		}
		return vn;
	}
	newHTML = newHTML.replace(/<(.*?)>/g, function(v){ return setIndentLevel(v); } );
	
	// and now for some final cleanup.
	newHTML = newHTML.replace(/\n.\n/g, "\n" );
	newHTML = newHTML.replace(/\n\t*\n/g, "\n" );
	
	// Put content between <style>, <script>, and comment tags back.
	var cssArrayIndex = 0;
	newHTML = newHTML.replace(/\|\&\*\(\)\_\|/g, function(v){ return retrievePlaceHolderCSS(cssArray, cssArrayIndex++, '|&*()_|', newHTML); } );
	var scriptArrayIndex = 0;
	newHTML = newHTML.replace(/\|\&\&\*\*\_\|/g, function(v){ return retrievePlaceHolderCSS(scriptArray, scriptArrayIndex++, '|&&**_|', newHTML); } );
	var htmlCommentArrayIndex = 0;
	newHTML = newHTML.replace(/\|\!\-\^\%\&\|/g, function(v){ return retrievePlaceHolder(htmlCommentArray, htmlCommentArrayIndex++, '|!-^%&|', newHTML).replace(/\n|\t/g, "" ); } );		
	
	return newHTML;
}



function createPlaceholder(v, holderArray, spotMarker) // CREATE PLACEHOLDER TOKEN IN HTML AND STORE CONTENTS IN AN ARRAY SO THEY DON'T INTERFERE WITH THE BEAUTIFICATION.
{
	var indexBeginPlaceholder = v.indexOf('>')+1;
	var indexEndPlaceholder = v.lastIndexOf('</');
	//while (v.substring(indexBeginPlaceholder, indexBeginPlaceholder+1) == '\t' || v.substring(indexBeginPlaceholder, indexBeginPlaceholder+1) == '\n') indexBeginPlaceholder++;
	while (v.substring(indexEndPlaceholder-1, indexEndPlaceholder) == '\t' || v.substring(indexEndPlaceholder-1, indexEndPlaceholder) == '\n') indexEndPlaceholder--; // subtract all '\t' and '\n' chars before the end </style> tag.
	holderArray[holderArray.length] = v.substring(indexBeginPlaceholder, indexEndPlaceholder); // grab CSS content and...
	v = v.substring(0, indexBeginPlaceholder) + spotMarker + v.substring(v.lastIndexOf('</')); // replace CSS content with a token.
	return v;
}
function createCommentPlaceholder(v, holderArray, spotMarker)
{
	//alert(v);
	holderArray[holderArray.length] = v; // grab comment and store in array.
	return spotMarker;
}
function retrievePlaceHolder(holderArray, holderArrayIndex) // default?
{
	return holderArray[holderArrayIndex];
}
function retrievePlaceHolderCSS(holderArray, holderArrayIndex, spotMarker, newHTML) // CSS and SCRIPT
{
	var indentLevel = 0;
	var indentIndex = newHTML.indexOf(spotMarker);
	while (newHTML.substring(indentIndex-1, indentIndex) == "\t")
	{
		indentIndex--;
		indentLevel++;
	}
	return beautifyEditorCSSformat(holderArray[holderArrayIndex], indentLevel);
}





function beautifyEditorCSSformat(newCSS, indentLevel)
{
	//var vArray = newCSS.split(/([{}])/); // Split on brackets.
	var vArray = newCSS.split(/([{}]|\/\*.*?\*\/)/); // Split on brackets and comments.	
	var tabLine = "";
	newCSS = "";
	var firstrun = false;
	
	for (var i = 0; i < vArray.length; i++)
	{
		var vt = vArray[i];
		if (vt != "" && vt != null)
		{	
			if (vt == "}") indentLevel--;
				tabLine = "\n"; // only add newline and tabs after first line.
				for (var j = 0; j < indentLevel; j++) tabLine += "\t";
									
				if ((vt.match(/\/\*(.*?)\*\//)||[]).length < 1)
				{
					vt = vt.replace(/; /g, function(v){ return v.substring(0, 1); } ); // remove spaces between style elements...
					vt = vt.replace(/;/g, function(v){ return v + tabLine; } ); // then put each element on a new line.
				}
				
				if (firstrun) vt = tabLine + vt;
				firstrun = true;
				newCSS += vt;
			if (vArray[i] == "{") indentLevel++;
		}
	}
	
	// and now for some final cleanup.
	newCSS = newCSS.replace(/\n.\n/g, "\n" );
	newCSS = newCSS.replace(/\n\t*\n/g, "\n" );
	// cleanup any extra "\t" and "\n" at the end of the script section. (side-effect of the ";" newlines)
	var endOfCSS = newCSS.length;
	while (newCSS.substring(endOfCSS-1, endOfCSS) == "\t" || newCSS.substring(endOfCSS-1, endOfCSS) == "\n" || newCSS.substring(endOfCSS-1, endOfCSS) == " ") endOfCSS--;
	newCSS = newCSS.substring(0, endOfCSS);
	
	//if (newCSS == "") newCSS = "// empty";
	
	return newCSS;
}


function scrubCSS()
{	
	var documentWithCSS = document.createElement("html");
	documentWithCSS.innerHTML = document.getElementById('scrubberTextInputID').value;
	var allElems = documentWithCSS.getElementsByTagName("*");
	for (var i=0, max=allElems.length; i < max; i++)
	{
		var element = allElems[i];			
		removeElementStyles(element);
	}
	var newHTML = documentWithCSS.innerHTML;
	
	//========================= (START) USING REGEX TO FIND AND REPLACE JUNK CODE LITTERING THE PAGE ============================
	// remove residual empty tags (tags that were completely scrubbed out, see below).
	newHTML = newHTML.replace(/<link>/g,'');
	
	// clear out the overused <span> elements that litter the document.
	if (document.getElementById('clearSpanId').checked == 1)
	{
		newHTML = newHTML.replace(/<span>/g,'');
		newHTML = newHTML.replace(/<\/span>/g,'');
	}
	
	// replace <hr> (unsupported in HTML5) with <div style="border-top:1px solid black;"></div>.
	var HTML5dividerLine = '<div class="scrubberExclusionClass" style="border-top:1px solid black;"></div>';
	newHTML = newHTML.replace(/<hr>/g, HTML5dividerLine);
	newHTML = newHTML.replace(/<hr\/>/g, HTML5dividerLine);
	newHTML = newHTML.replace(/<hr \/>/g, HTML5dividerLine);
	newHTML = newHTML.replace(/(_)\1+/g, HTML5dividerLine); // replace any occurrences of '____...' that were manually written in to create a divider line.

	newHTML = beautifyEditorHTMLformat(newHTML);
	//========================= (END) USING REGEX TO FIND AND REPLACE JUNK CODE LITTERING THE PAGE ============================
	
	document.getElementById('scrubberTextInputID').value = newHTML;
	
	updatePreviewHTML(newHTML);
}


function removeElementStyles(element) // re-initialize all page elements, minus their classes, ids, inline styles, etc...
{
	if (element)
	{
		if (element.className == "scrubberExclusionClass")
		{
			// do not scrub items with this class.
		}
		else if (element.tagName == "STYLE") element.parentNode.removeChild(element); // remove all style elements.
		else
		{
			if (element.style) element.removeAttribute("style"); // clear inline styles.
			if (document.getElementById('clearClassesId').checked == 1 && element.className) if (element.style) element.removeAttribute("class"); // clear classnames if that option is checked.
			
			// elements to be completely scrubbed out.
			if (element.tagName == "SPAN" || element.tagName == "LINK")
			{
				if (document.getElementById('clearSpanId').checked == 1)
				{
					// Re-initialize the SPAN to wipe out all its style/etc attributes. Leaves SPAN elements in place (bummer), but keeps innerHTML intact. Will remove SPAN tags later on in script (see above).
					//console.log("Tag: " + element.tagName + "\t | \t Parent: " + element.parentNode.tagName);
					
					var myReplacement = document.createElement(element.tagName);
					if (element.id) myReplacement.id = element.id;
					if (element.className) myReplacement.className = element.className;

					myReplacement.innerHTML = element.innerHTML; // eliminates styles included in same file instead of a separate stylesheet.
					if (element.parentNode != null) 
						element.parentNode.replaceChild(myReplacement, element);
				}
			}
			else if (element.tagName == "B") // replace all <b> tags with <strong> tags for consistency.
			{
				var myReplacement = document.createElement("STRONG");
				if (element.id) myReplacement.id = element.id;
				if (element.className) myReplacement.className = element.className;

				myReplacement.innerHTML = element.innerHTML; // eliminates styles included in same file instead of a separate stylesheet.
				if (element.parentNode != null) 
					element.parentNode.replaceChild(myReplacement, element);
			}
			
		}
	}
}	