// EDITOR

const editor = document.querySelector('.editor');
const controlBtns = [...document.querySelectorAll('.controls.btn')];
const fontSize = document.querySelector('#font-size');
const fontFamily = document.querySelector('#font-family');

controlBtns[0].addEventListener('click', () => document.execCommand('bold', false, null) );
controlBtns[1].addEventListener('click', () => document.execCommand('italic', false, null) );
controlBtns[2].addEventListener('click', () => document.execCommand('underline', false, null) );
controlBtns[3].addEventListener('click', () => document.execCommand('strikethrough', false, null) );

editor.addEventListener('keydown', function() {
	document.execCommand('fontSize', false, fontSize.value);
});

fontFamily.addEventListener('input', function() {
	document.execCommand('fontName', false, this.value);
});

// TREEVIEW

const tree = document.querySelector('.tree-wrapper');
const root = document.querySelector('.root');

tree.addEventListener('click', e => {
	const target = e.srcElement;
	const parent = target.parentElement;
	if ([...target.classList].includes('fa-plus')) {
		const ul = parent.querySelector('ul') || function(){
			let result = document.createElement('ul');
			parent.appendChild(result);
			return result;
		}();
		const collapse = document.createElement('i');
		collapse.classList.add('fa');
		collapse.classList.add('fa-file');
		collapse.classList.add('collapse');
		collapse.ariaHidden = 'true';
		const li = document.createElement('li');
		const button = document.createElement('i');
		button.classList.add('fa');
		button.classList.add('fa-plus');
		button.ariaHidden = 'true';
		const span = document.createElement('span');
		span.textContent = `Double-click to edit `;
		span.classList.add('sub-title');
		li.classList.add('node');
		li.appendChild(collapse);
		li.appendChild(span);
		li.appendChild(button);
		ul.appendChild(li);
	}
});

root.addEventListener('dblclick', (e) => {
	const target = e.target;
	if ([...target.classList].includes('sub-title')) {
		const cache = target.textContent;
		target.contentEditable = true;
		target.focus();	
		const save = function() {
			const closure = function() {
				this.removeAttribute('autofocus');
				this.removeAttribute('contentEditable');
				target.removeEventListener('blur', closure);
				target.textContent = target.textContent || cache;
			};
			return closure;
		}();
		target.addEventListener('blur', save);
	}
});
