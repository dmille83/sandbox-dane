// Prevents form suggestion 
function disableAutocomplete() {
	$( document ).on( 'focus', 'input', function(){ 
		$( this ).attr( 'autocomplete', 'chrome-off' ); 
	});
}

function showFormLoadingMessage(boolEnable) {
	if (boolEnable == true) {
		if (document.querySelectorAll('#softdocsLoadingBar').length > -1) {
		   $( '#softdocsLoadingBar' ).css('display', '');
		} else {
			$( 'body' ).prepend('<div id="softdocsLoadingBar" style="display: block; position: fixed; width: 50%; text-align: center; margin: 25% 25% 25% 25%; background: white; z-index: 999; font-size: 26px; font-weight: bold; padding: 20px; border: 4px solid black;">Loading form, please wait...</div>');
		}
	} else {
		$( '#softdocsLoadingBar' ).css('display', 'none');
	}
}
