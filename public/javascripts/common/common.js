var runmacro=false;
var macroTimer  = 0;

function sgCreateNode(tagName, properties){
	if (!tagName) tagName = 'DIV'
	var d = document.createElement(tagName);
	
	return domHelper.mapToElement(d,properties);
	for (var i in properties) {
		switch (i) {
			case 'onclick':
			case 'onmouseup':
			case 'onmousedown':
				d.onmousedown = properties[i];
			break;
			case 'className':
				properties[i]=properties[i].replace(/undefined/g,'').trim();
			case 'innerHTML':
			case 'name':
			case 'id':
				d[i] = properties[i];
			break;
			case 'parentNode':
				properties[i].appendChild(d);
			break;
			case 'pcolor':
			case 'fila':
			case 'orientacion':
			case 'columna':
			case 'state':
				d.setAttribute(i,properties[i]);
			break;
			case 'display': 
			case 'top': 
			case 'left':
				d.style[i]=properties[i];
			break;
			case 'src':
				var img = sgCreateNode('IMG',{parentNode:d});
				img.src = properties[i];
			
			break;
		}
	}
	return d;
}


/*	Extrae de una cadena de texto, el valor numérico de la misma,
	Originalmente, orientada a obtener el dato numérico cargado en 
	un estilo css, como por ejemplo: top:10px. */
function getNumericValue(s) {
	var result = s ? s : '';
	if (typeof(result)=='undefined' || result===null)
		return 0;
	result = result.replace(regexcssval,'');
	if (result == '')
		return 0;
	return +result;
}

function toogle2(event,node,attr) {
	var v = node.getAttribute(attr);
	if (typeof(v)=='undefined')
		v = 0;
	node.setAttribute(attr,1-v);
	if (event.stopPropagation) event.stopPropagation();
	event.cancelBubble=true;
	return true;

}

function toogle(e,a) {
	var v = e.getAttribute(a);
	if (typeof(v)=='undefined')
		v = 0;
	e.setAttribute(a,1-v);
	if (e.stopPropagation) e.stopPropagation();
	e.cancelBubble=true;
	return true;
}

function toogleto(e,a,v){
	e.setAttribute(a,v)
}


function sendKey(k, target, alt, ctrl, shft) {
	var e = {altKey:alt || false, ctrlKey: ctrl || false, shiftKey: shft|| false,
		preventDefault:function(){}, stopPropagation:function(){}, cancelBubble:true, x:0, y: 0, 'targat':target|| null};
	switch(k) {
		case 'RIGHT': e.keyCode=39; break;
	}
	chess.keyDown(e);
}

function macro(n, r, o) {
	if (macroTimer) macroTimer = clearTimeout(macroTimer);
	if (!runmacro) return;
	switch(n) {
		case 1:	rooms.getElement('LISTENER','ENTRENAR').click(); break;
		case 2:	rooms.rooms[r].aperturas();
			rooms.rooms[r].element.querySelector('li#DSVDN').click();
			macroTimer = setTimeout('macro(3,"RIGHT")',500);
		break;
		case 3: sendKey(r); break;
	}
}

function cancelEvent(e) {
	if (e && e.preventDefault) e.preventDefault();
	if (e && e.stopPropagation) e.stopPropagation();
	if (e) e.cancelBubbles=true;
	return false;
}


function stopEvent(e) {
	if (e.stopPropagation)
		e.stopPropagation();
	e.cancelBubble = true;
	return false;
}

String.prototype.padLeft = function padLeft(length,pad) {
	return this.getPad(length,pad)+this;
}

String.prototype.getPad = function getPad(length,pad) {
	if (!pad) pad = ' ';
	var pre='';
	for (var i=this.length; i<length; ++i) {
		pre+=pad;
	}
	return pre;
}

String.prototype.padRight = function padRight(length,pad) {
	return this+this.getPad(length,pad);
}
