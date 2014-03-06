function IPanel(){}
IPanel.prototype = new ISgControl()
IPanel.prototype.proto='ISgControl';

IPanel.prototype.init = function init(){
	var args ={
		eargs:{className:'panel'},
		oargs:{innited:true, controlFlier:true,handler:this},
		common:{}
		}
	
	window[IPanel.prototype.proto].prototype.init.call(this,args,arguments[0]);
	
}

function Panel(){
	this.init(arguments[0]);
}
Panel.prototype = new IPanel();