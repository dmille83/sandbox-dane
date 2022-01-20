// Host this .js file on GitHub.

// To accomplish this you will need to use some custom JavaScript inside the' viewmodel.js' file of your form. 
// Place the following inside the afterLoad() block.

// Format money with commas (text field)
function initMoneyCommas() {
    function registerMoneyCommas() {
    	[].forEach.call(document.querySelectorAll('input[data-bind]'), function(element) {
    		console.log(element.getAttribute('id') + '==' + element.getAttribute('data-bind'));
    		if (element.getAttribute('data-bind').includes("money")) {
    			element.addEventListener('change', function() { triggerMoneyCommas(this); }, false);
    		}
    	});
    }
    function triggerMoneyCommas(elem) {
    	formatMoneyCommas(elem);
    	[].forEach.call(document.querySelectorAll('input[data-bind]'), function(element) {
    		if (element.getAttribute('data-bind').includes("money") && element.getAttribute('data-bind').includes("calculate")) {
    			formatMoneyCommas(element);
    		}
    	});
    }
    function formatMoneyCommas(elem) {
    	var val = elem.value;
    	var parts = val.toString().split(".");
    	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    	elem.value = parts.join(".");
    }
    [].forEach.call(document.querySelectorAll('button'), function(element) {
    	console.log(element.getAttribute('id') + '==' + element.getAttribute('data-bind'));
    	element.addEventListener('click', function() { registerMoneyCommas(); }, false);
    });
    registerMoneyCommas();
}

// Format email address as ___@ksu.edu (text field)
function initEmailKSU() {
	function registerEmailKSU() {
		[].forEach.call(document.querySelectorAll('.maskemail'), function(element) {
			element.addEventListener('change', function() { formatEmailKSU(this); }, false);
		});
	}
	function formatEmailKSU(elem) {
		var val = elem.value;
		if (val == null || val.toString() == "") { return; }
		var parts = val.toString().split('@');
		if (parts.length == 1 || parts[1].toString() == 'k-state.edu') {
			elem.value = parts[0] + "@ksu.edu";
		}
	}
	[].forEach.call(document.querySelectorAll('button'), function(element) {
		console.log(element.getAttribute('id') + '==' + element.getAttribute('data-bind'));
		element.addEventListener('click', function() { registerEmailKSU(); }, false);
	});
	registerEmailKSU();
}
