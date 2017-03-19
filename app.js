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
	}
});

// TREE

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
		const node = getNodeNo.next().value;	
		currentData[node] = {};
		currentData[node]['data'] = 'Start writing...';
		currentData[node]['title'] = 'Untitled';
		currentData[node]['parent'] = parent.id;
		renderNode(parent, node);
		pushToLocalStorage();
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

window.addEventListener('hashchange', function(e) {
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
	}
});

function storeData() {
	const data = String(this.innerHTML);
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
editor.addEventListener('paste', function() {
	window.setTimeout(() => storeData.bind(this)(), 1000);
});
titleName.addEventListener('input', storeTitle);
titleName.addEventListener('paste', storeTitle);
remove.addEventListener('click', removeNode);