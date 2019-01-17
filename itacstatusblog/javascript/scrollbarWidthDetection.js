//<body>
//</body>
//<script>

function getScrollbarWidth() {
	var outer = document.createElement("div");
	outer.style.visibility = "hidden";
	outer.style.width = "100px";
	document.body.appendChild(outer);
	
	var widthNoScroll = outer.offsetWidth;
	// force scrollbars
	outer.style.overflow = "scroll";
	
	// add innerdiv
	var inner = document.createElement("div");
	inner.style.width = "100%";
	outer.appendChild(inner);        
	
	var widthWithScroll = inner.offsetWidth;
	
	// remove divs
	outer.parentNode.removeChild(outer);
	
	var scrollbarWidth = widthNoScroll - widthWithScroll;
	
	//alert(scrollbarWidth);
	return scrollbarWidth;
}

//document.body.innerHTML = "Scrollbar width is: "+getScrollbarWidth()+"px";
//</script>

