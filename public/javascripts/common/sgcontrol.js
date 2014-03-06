function ISgControl(){}
ISgControl.prototype.mergeArgs = function mergeArgs(gargs,pargs){
	var eargs = gargs && gargs.eargs ? gargs.eargs : {}
	var oargs = gargs && gargs.oargs ? gargs.oargs : {}
	var common = gargs && gargs.common ? gargs.common : {}
	if (pargs) {
		if (pargs.eargs) {
			for (var i in pargs.eargs) {
				if (i=='className') 
					eargs[i]=eargs[i]+' '+pargs.eargs[i];
				else
					eargs[i]=pargs.eargs[i];
			}
		}
		if (pargs.oargs) {
			for (var i in pargs.oargs) {
				oargs[i]=pargs.oargs[i]
			}
		}
		if (pargs.common) {
			for (var i in pargs.common) {
				common[i]=pargs.common[i]
			}
		}
	}
	return {'eargs':eargs, 'oargs':oargs, 'common':common}
}

ISgControl.prototype.moveElementTo = function moveElementTo(x,y){
	var r = this.element.getClientRects()[0];
	var scaled = this.scaled?this.scaled:1;
	this.element.style.position='fixed';
	
	this.element.style.height = r.height*scaled+'px';
	this.element.style.width = r.width*scaled+'px';
	this.element.style.bottom = 'auto';
	this.element.style.right = 'auto';
	this.element.style.left = x*scaled+'px';
	this.element.style.top = y*scaled+'px';
	// this.element.style.left = x+'px¡;
	// this.element.style.top = y+'px';
}

ISgControl.prototype.init = function init(gargs,pargs){
	var args = this.mergeArgs(gargs,pargs);
	var eargs = args.eargs;
	var oargs = args.oargs;
	var common = args.common;

	for (var i in common) {
		eargs[i]=oargs[i]=common[i];
	}
	for (var i in oargs) {
		this[i]=oargs[i];
	}
	this.element = sgCreateNode('DIV',eargs);
	if (this.controlFlier) {
		var args = {
			eargs:{parentNode:this.element},
			oargs:{handler:this.handler?this.handler:this},
			common:{d: (this.id?this.id:this.guid?this.guid:'GUID')+'_'+guid}
		}
		this.controlFlier = new FlierControl(args);
	}
	
}
