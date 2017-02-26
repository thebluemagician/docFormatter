<<<<<<< HEAD
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
=======
const currentData = window.localStorage.docFormatter ? JSON.parse(window.localStorage.docFormatter) : { currentNode: 1, 'root': { title: 'The Title', data: ''}}

function pushToLocalStorage() {
	window.localStorage.setItem('docFormatter', JSON.stringify(currentData));
}

// EDITOR

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }]
];

const quill = new Quill('#editor', {
	theme: 'snow',
	modules: {
		toolbar: toolbarOptions
>>>>>>> 395d6b0e782f95adf3ccd9871ec0e99e317f693f
	}
});

<<<<<<< HEAD
// TREE

const tree = document.querySelector('.tree-wrapper');

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

function* nodeGenerator() {
	while (true) {
		yield `node${currentData.currentNode++}`;
	}
}

const getNodeNo = nodeGenerator();

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

		const node = getNodeNo.next().value;
		link.href = `#/${node}`;
		link.textContent = `Untitled`;
		link.setAttribute('data-link', node);
		
		currentData[node] = {};
		currentData[node]['data'] = 'Start writing...';
		currentData[node]['title'] = 'Untitled';

		pushToLocalStorage();
		
		li.classList.add('node');
		li.appendChild(collapse);
		li.appendChild(link);
		li.appendChild(button);
		ul.appendChild(li);
		parentIcon(parent);
	}
});

// DATA STORAGE AND LINKAGE

const titleName = document.querySelector('.title-name');
const remove = document.querySelector('.remove');
const editor = document.querySelector('.ql-editor');
const root = document.querySelector('.root');


function getCurrentAddress() {
	return String(window.location.hash.substring(2, window.location.hash.length));
}

window.addEventListener('hashchange', function(e) {
	const location = getCurrentAddress();
	const activeLink = root.querySelector(`a[data-link=${location}]`);
	[...root.querySelectorAll('a')].forEach( a => {
		if (a.getAttribute('data-link') === location) {
			a.classList.add('active');
		} else {
			a.classList.remove('active');
		}
	});
	editor.innerHTML = currentData[location]['data'];
	titleName.value = currentData[location]['title'];
});

function storeData() {
	const data = String(this.innerHTML);
	const node = getCurrentAddress();
	currentData[node]['data'] = data;
	pushToLocalStorage();
}

function storeTitle() {
	const node = getCurrentAddress();
	const value = this.value.trim();
	currentData[node]['title'] = value;
	pushToLocalStorage();
	const element = root.querySelector(`a[data-link=${node}]`);
	element.textContent = value;
}

function removeNode() {
	const node = getCurrentAddress();
	if (node === 'root') {
		alert('Cannot delete root');
		return;
	}
	delete currentData[node];
	pushToLocalStorage();
	const element = root.querySelector(`a[data-link=${node}]`);
	const ul = element.parentElement.parentElement;
	const li = element.parentElement;
	ul.removeChild(li);
}

editor.addEventListener('input', storeData);
titleName.addEventListener('input', storeTitle);
remove.addEventListener('click', removeNode);

document.querySelector('.format').addEventListener('click', () => {
	window.localStorage.removeItem('docFormatter');
	window.location.reload();
})
=======
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
>>>>>>> 49bba03abd38dbe1127fdb8370ff7b7faef3e7c2
