function IFlierControl(){}
IFlierControl.prototype = new ISgControl()
IFlierControl.prototype.proto='ISgControl';


IFlierControl.prototype.getElement = function getElement(e,o) {
	switch(e) {
		case 'MASK':
			return this.mask;
		break;
	}
}
IFlierControl.prototype.mousedown = function mouseDown(e,o) {
	this.mask.setAttribute('state',1);
	this.element.setAttribute('state',1);
	this.rect = this.handler.element.getClientRects()[0];
	// if (this.handler.scaled) {
		// this.rect.top*=this.handler.scaled;
		// this.rect.left*=this.handler.scaled;
	// }
	this.mouseCoord = {y:e.clientY,x:e.clientX};
	flier.setHandler(['mouseup','mousemove'],this,this.mouseCoord);
}

IFlierControl.prototype.mouseup = function mouseup(e,o,delta) {
	
	this.mask.setAttribute('state',0);
	this.element.setAttribute('state',0);
	return true;
}

IFlierControl.prototype.mousemove = function mousemove(e,o,delta) {
	//console.log([this.rect,delta,e,this.handler.element.getClientRects()[0]])
	this.handler.moveElementTo(+this.rect.left+(+delta[1]),+this.rect.top+(+delta[0]));
}

IFlierControl.prototype.initCapturer = function initCapturer() {
	flier.init();
}

IFlierControl.prototype.init = function init() {
	var oargs = arguments[0].oargs || {},
			eargs = arguments[0].eargs || {},
			common = arguments[0].common || {};
		eargs.className += ' flier-control';
		
		var this_=this;
		common.guid = 'FLIER_'+guid;
		eargs.onmousedown = function(){
			this_.mousedown(arguments[0],this);
		}
		window[IFlierControl.prototype.proto].prototype.init.call(this,{},{
			'eargs':eargs,
			'oargs':oargs,
			'common':common
		})
	
	var d=document.createElement('DIV');
	d.className = 'flier-mask';
	d.id=this.id+'_mask'+guid;
	this.handler.element.appendChild(d);
	this.mask=d;
	this.initCapturer();
	
}


function FlierControl(){
	this.init(arguments[0]);
}

FlierControl.prototype = new IFlierControl();