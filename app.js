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
=======
window.location.hash = '';
window.location.hash = '/root';

const currentData = window.localStorage.docFormatter ? JSON.parse(window.localStorage.docFormatter) : {
	currentNode: 1,
	'root': {
		title: 'The Title',
		data: ''
	}
};
const tree = document.querySelector('.tree-wrapper');
loadTree();

function pushToLocalStorage() {
	window.localStorage.setItem('docFormatter', JSON.stringify(currentData));
}

// EDITOR

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block', 'image'],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }]
];
>>>>>>> quill

editor.addEventListener('keydown', function() {
	document.execCommand('fontSize', false, fontSize.value);
});

<<<<<<< HEAD
fontFamily.addEventListener('input', function() {
	document.execCommand('fontName', false, this.value);
});

// TREEVIEW

const tree = document.querySelector('.tree-wrapper');
const root = document.querySelector('.root');
=======
//Modal and tooltip container

window.onload = function () {
	const cl = document.querySelector(".close-btn");
	cl.onclick = function () {
		document.getElementById('modal').style.display = "none";
	}
};

function modal_display() {
	document.querySelector('#modal').style.display='block';
}

function tooltip() {
	clearTooltips();
	const currentAddress = getCurrentAddress();
	const currentNode = document.querySelector(`#${currentAddress} .fa.fa-plus`);
	const tp = document.createElement('div');
	tp.className = 'tooltip';
	tp.innerHTML = `
	<span class="tooltiptext">
		<i class="fa fa-pencil" aria-hidden="true" onclick="modal_display()"></i>
		<i class="fa fa-files-o" aria-hidden="true"></i>
		<i class="fa fa-trash" aria-hidden="true" onclick="removeNode()"></i>
	</span>
	`;
	insertAfter(tp, currentNode);
}

function insertAfter(newElement, refElement) {
	refElement.parentNode.insertBefore(newElement, refElement.nextSibling);
}

function clearTooltips() {
	const tp = document.querySelector(".tooltip");
	if (tp) { tp.parentNode.removeChild(tp); }
}

document.addEventListener('click', clearTooltips);

// TREE
>>>>>>> quill

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
<<<<<<< HEAD
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
=======
		const node = getNodeNo.next().value;	
		currentData[node] = {};
		currentData[node]['data'] = 'Start writing...';
		currentData[node]['title'] = 'Untitled';
		currentData[node]['parent'] = parent.id;
		renderNode(parent, node);
		pushToLocalStorage();
	}
});

tree.addEventListener('dblclick', e => {
	if ([...e.target.classList].includes('active')) {
		e.preventDefault();
		const currentAddress = getCurrentAddress();
		window.location.hash = '';
		window.location.hash = `/${currentAddress}`;
	}
});

function loadTree() {
	tree.querySelector('.title').textContent = currentData.root.title;
	for (let i in currentData) {
		if (currentData[i].parent) {
			const parent = document.querySelector(`#${currentData[i].parent}`);
			const node = i;
			renderNode(parent, node);
		}
	}
}

function renderNode(parent, node) {
	const ul = parent.querySelector('ul') || function() {
		let result = document.createElement('ul');
		parent.appendChild(result);
		return result;
	}();
	const li = document.createElement('li');
	li.id = node;
	li.classList.add('nodes');
	li.innerHTML = `
		<i class="fa fa-file expand" aria-hidden="true"></i>
		<a href="#/${node}" data-link="${node}">${currentData[node]['title']}</a>
		<i class="fa fa-plus" aria-hidden="true"></i>
	`;
	ul.appendChild(li);
	parentIcon(parent);
}

// DATA STORAGE AND LINKAGE

const titleName = document.querySelector('.title-name');
const remove = document.querySelector('.remove');
const editor = document.querySelector('.ql-editor');
const root = document.querySelector('.root');


function getCurrentAddress() {
	return String(window.location.hash.substring(2, window.location.hash.length));
	
}
>>>>>>> quill

// LOCAL STORAGE
window.addEventListener('hashchange', function(e) {
<<<<<<< HEAD
	const location = this.location.hash.substring(2, this.location.hash.length);
	const currentData = JSON.parse(window.localStorage.docFormatter);
	editor.innerHTML = currentData[location];
=======
	if (this.location.hash) {
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
		tooltip();
	}
>>>>>>> quill
});

function store() {
	const data = String(this.innerHTML);
<<<<<<< HEAD
	const subtitle = String(window.location.hash.substring(2, window.location.hash.length));
	dataSet.title = "Demo Paper";
	dataSet[subtitle] = data;
	window.localStorage.setItem('docFormatter', JSON.stringify(dataSet));
}

editor.addEventListener('input', store);
=======
	const node = getCurrentAddress();
	currentData[node]['data'] = data;
	pushToLocalStorage();
	
}

function storeTitle() {
	const node = getCurrentAddress();
	const value = this.value.trim() || 'Untitled';
	currentData[node]['title'] = value;
	pushToLocalStorage();
	if (node === 'root') {
		root.querySelector('.title').textContent = value;
	} else {
		const element = root.querySelector(`a[data-link=${node}]`);
		element.textContent = value;
	}
}

function removeNode() {
	const node = getCurrentAddress();
	if (node === 'root') {
		alert('Cannot delete root');
		return;
	}
	delete currentData[node];
	deleteChildren(node);
	pushToLocalStorage();
	const element = root.querySelector(`a[data-link=${node}]`);
	const ul = element.parentElement.parentElement;
	const li = element.parentElement;
	ul.removeChild(li);
	window.location.hash = '/root';
}

function deleteChildren(node) {
	for (let i in currentData) {
		if (currentData[i].parent === node) {
			delete currentData[i];
			deleteChildren(i);
		}
	}
}

editor.addEventListener('input', storeData);
editor.addEventListener('focus', function() {
	window.setTimeout(() => storeData.bind(this)(), 1000);
});
titleName.addEventListener('input', storeTitle);
titleName.addEventListener('paste', storeTitle);
remove.addEventListener('click', removeNode);
>>>>>>> quill
