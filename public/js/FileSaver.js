function FileSaver(){

}

FileSaver.download = function(blob, filename) {
	var element = document.createElement('a');
	element.setAttribute('href', window.URL.createObjectURL(new Blob([blob])));
	element.setAttribute('download', filename);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}