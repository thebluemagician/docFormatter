const editor = document.querySelector('.editor');
const controlBtns = [...document.querySelectorAll('.controls.btn')];
const fontSize = document.querySelector('#font-size');
const fontFamily = document.querySelector('#font-family');

controlBtns[0].addEventListener('click', () => document.execCommand('bold', false, null) );
controlBtns[1].addEventListener('click', () => document.execCommand('italic', false, null) );
controlBtns[2].addEventListener('click', () => document.execCommand('underline', false, null) );
controlBtns[3].addEventListener('click', () => document.execCommand('strikethrough', false, null) );

editor.addEventListener('keydown', function() {
	document.execCommand('fontSize', false, `${fontSize.value}`);
});

fontFamily.addEventListener('input', function() {
	document.execCommand('fontName', false, this.value);
});