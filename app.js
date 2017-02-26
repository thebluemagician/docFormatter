const currentData = window.localStorage.docFormatter ? JSON.parse(window.localStorage.docFormatter) : {
	currentNode: 1,
	'root': {
		title: 'The Title',
		data: ''
	}
};

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
	for (let i in currentData) {
		if (currentData[i].parent) {
			const parent = document.querySelector(`#${currentData[i].parent}`);
			const node = i;
			renderNode(parent, node);
		}
	}
}

function renderNode(parent, node) {
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
  link.href = `#/${node}`;
	link.textContent = currentData[node]['title'];
	link.setAttribute('data-link', node);
  li.id = node;
	li.classList.add('nodes');
  li.appendChild(collapse);
  li.appendChild(link);
  li.appendChild(button);
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
	deleteChildren(node);
	pushToLocalStorage();
	const element = root.querySelector(`a[data-link=${node}]`);
	const ul = element.parentElement.parentElement;
	const li = element.parentElement;
	ul.removeChild(li);
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
titleName.addEventListener('input', storeTitle);
remove.addEventListener('click', removeNode);