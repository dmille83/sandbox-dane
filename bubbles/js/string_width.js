String.prototype.width = function(font) {
  var f = font || '12px arial',
      o = $('<div>' + this + '</div>')
            .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
            .appendTo($('body')),
      w = o.width();

  o.remove();

  //console.log("[" + this + "] width = " + w);
  
  return w;
}

String.prototype.height = function(font) {
  var f = font || '12px arial',
      o = $('<div>' + this + '</div>')
            .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
            .appendTo($('body')),
      h = o.height();

  o.remove();

  //console.log("[" + this + "] width = " + h);
  
  return h;
}

/*
var string_width = function(txt, font) {
  var f = font || '12px arial',
      o = $('<div>' + txt + '</div>')
            .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
            .appendTo($('body')),
      w = o.width();

  o.remove();

  console.log("[" + txt + "] width = " + w);
  
  return w;
}
*/