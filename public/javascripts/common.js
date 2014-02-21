function stopEvent(e) {
	if (e.stopPropagation)
		e.stopPropagation();
	e.cancelBubble = true;
	return false;
}