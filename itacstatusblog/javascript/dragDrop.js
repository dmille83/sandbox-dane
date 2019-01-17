// SOURCE:  http://stackoverflow.com/questions/7625401/swap-elements-when-you-drag-one-onto-another-using-jquery-ui

$(document).ready(function (){

	jQuery.fn.swap = function(b){ 
		// method from: http://blog.pengoworks.com/index.cfm/2008/9/24/A-quick-and-dirty-swap-method-for-jQuery
		b = jQuery(b)[0]; 
		var a = this[0]; 
		var t = a.parentNode.insertBefore(document.createTextNode(''), a); 
		b.parentNode.insertBefore(a, b); 
		t.parentNode.insertBefore(b, t); 
		t.parentNode.removeChild(t); 
		return this; 
	};

	//alert(		$( ".overlay" ).parent().attr('id')		);

	$( ".overlay" ).parent().draggable({ revert: true, helper: "clone" });

	$( ".overlay" ).parent().droppable({
		accept: ".dragdrop",
		activeClass: "ui-state-hover",
		hoverClass: "ui-state-active",
		drop: function( event, ui ) {
			console.log('dropped');

			var draggable = ui.draggable, droppable = $(this),
				dragPos = draggable.position(), dropPos = droppable.position();
			/*
			draggable.css({
				left: dropPos.left+'px',
				top: dropPos.top+'px'
			});

			droppable.css({
				left: dragPos.left+'px',
				top: dragPos.top+'px'
			});
			*/
			draggable.swap(droppable);
		}
	});
	
});