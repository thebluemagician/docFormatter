// EDITOR

const editor = document.querySelector('.editor');
const controlBtns = [...document.querySelectorAll('.controls.btn')];
const fontSize = document.querySelector('#font-size');
const fontFamily = document.querySelector('#font-family');

const dataSet = {};

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

function parentIcon(parent) {
	const icon = parent.querySelector('.expand');
	if (parent.querySelector('ul')) {
		icon.classList.remove('fa-file');
		icon.classList.add('fa-folder');
	} else {
		icon.classList.remove('fa-folder');
		icon.classList.add('fa-file');
	}
}

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
		collapse.classList.add('expand');
		collapse.ariaHidden = 'true';
		const li = document.createElement('li');
		const button = document.createElement('i');
		button.classList.add('fa');
		button.classList.add('fa-plus');
		button.ariaHidden = 'true';
		const link = document.createElement('a');
		link.href = '#/'
		link.textContent = ` Double-click to edit `;
		link.classList.add('sub-title');
		li.classList.add('node');
		li.appendChild(collapse);
		li.appendChild(link);
		li.appendChild(button);
		ul.appendChild(li);
		parentIcon(parent);
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
				this.removeAttribute('contentEditable');
				target.removeEventListener('blur', closure);
				target.textContent = target.textContent.trim() || cache;
				const linkValue = target.textContent.split(' ').filter(x => x).join('-').toLowerCase();
				target.href = `#/${linkValue}`;
				target.setAttribute('data-link', linkValue);
			};
			return closure;
		}();
		target.addEventListener('blur', save);
	}
});

// LOCAL STORAGE
window.addEventListener('hashchange', function(e) {
	const location = this.location.hash.substring(2, this.location.hash.length);
	const currentData = JSON.parse(window.localStorage.docFormatter);
	editor.innerHTML = currentData[location];
});

function store() {
	const data = String(this.innerHTML);
	const subtitle = String(window.location.hash.substring(2, window.location.hash.length));
	dataSet.title = "Demo Paper";
	dataSet[subtitle] = data;
	window.localStorage.setItem('docFormatter', JSON.stringify(dataSet));
}

editor.addEventListener('input', store);