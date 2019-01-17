var _, advancedEditor, authorship, cursorManager;

_ = Quill.require('lodash');

advancedEditor = new Quill('.advanced-wrapper .editor-container', {
  modules: {
	'authorship': {
	  authorId: 'advanced',
	  enabled: true
	},
	'toolbar': {
	  container: '.advanced-wrapper .toolbar-container'
	},
	'link-tooltip': true,
	'image-tooltip': true,
	'multi-cursor': true
  },
  styles: false,
  theme: 'snow'
});

authorship = advancedEditor.getModule('authorship');

authorship.addAuthor('basic', 'rgba(255,153,51,0.4)');

cursorManager = advancedEditor.getModule('multi-cursor');

cursorManager.setCursor('basic', 0, 'basic', 'rgba(255,153,51,0.9)');

advancedEditor.on('selection-change', function(range) {
  //return console.info('advanced', 'selection', range);
});

advancedEditor.on('text-change', function(delta, source) {
	var sourceDelta;
	if (source === 'api') {
		return;
	}
	//console.info('advanced', 'text', delta, source);
	//sourceDelta = advancedEditor.getContents();
	//return console.assert(_.isEqual(sourceDelta, targetDelta), "Editor diversion!", sourceDelta.ops, targetDelta.ops);
	
	//console.log('editor changed');
	
	sourceDelta = advancedEditor.getHTML();
	updatePreviewHTML(sourceDelta);
	updateHtmlCode(sourceDelta);
});

// Set editor content to match copied HTML code
$( '#html_code' ).change(function() {
	//console.log('html_code changed');
	var newHtml = $( '#html_code' ).val();
	updateEditorHTML(newHtml);
	updatePreviewHTML(newHtml);
});

//-----------------//

// Set editor content to match copied HTML code
function updateEditorHTML(newHTML)
{
	advancedEditor.setHTML(newHTML);
}

// Show raw HTML in HTML Code textarea
function updateHtmlCode(newHTML)
{
	$( '#html_code' ).val( style_html(newHTML) );
}

// Set preview window iFrame to target a javascript object containing our HTML.
function updatePreviewHTML(newHTML)
{
	// Show raw HTML in HTML Code textarea
	//$( '#html_code' ).val( style_html(sourceDelta) );
	
	// Set preview window iFrame to target a javascript object containing our HTML.
	var targetP = $( '#html_iframe' )[0].contentWindow.document;
	targetP.open();
	targetP.close();
	
	$('body',targetP).append(newHTML);
	// Reset height of iFrame before setting it to the height of the page, or it will never resize to become SMALLER.
	$('#html_iframe').height("100px");
	$('#html_iframe').height($('body',targetP).height() + 30);
}