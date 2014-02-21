function ISgControl(){}
ISgControl.prototype.mergeArgs = function mergeArgs(gargs,pargs){
	var eargs = gargs && gargs.eargs ? gargs.eargs : {}
	var oargs = gargs && gargs.oargs ? gargs.oargs : {}
	var common = gargs && gargs.common ? gargs.common : {}
	if (pargs) {
		if (pargs.eargs) {
			for (var i in pargs.eargs) {
				eargs[i]=pargs.eargs[i]
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
	
}
