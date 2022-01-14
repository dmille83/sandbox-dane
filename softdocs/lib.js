// To accomplish this you will need to use some custom JavaScript inside the' viewmodel.js' file of your form. 
// Place the following inside the afterLoad() block. 
function initMoneyCommas() {
    function registerMoneyCommas() {
    	[].forEach.call(document.querySelectorAll('input[data-bind]'), function(element) {
    		console.log(element.getAttribute('id') + '==' + element.getAttribute('data-bind'));
    		if (element.getAttribute('data-bind').includes("money")) {
    			element.addEventListener('change', function() { MoneyCommasTrigger(this); }, false);
    		}
    	});
    }
    function triggerMoneyCommas(elem) {
    	MoneyCommasFormat(elem);
    	[].forEach.call(document.querySelectorAll('input[data-bind]'), function(element) {
    		if (element.getAttribute('data-bind').includes("money") && element.getAttribute('data-bind').includes("calculate")) {
    			MoneyCommasFormat(element);
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