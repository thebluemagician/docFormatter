function printDoc() {
	const virtualDoc = document.createElement('div');
	const serializedTree = serialize();
	virtualDoc.className = 'doc ql-container ql-snow';
	const rootHTML = `
		<div class='root nodes ql-editor'>
			<h1 class='ql-align-justify' id='main-title'>${currentData.root.title}</h1>
			${currentData.root.data}
		</div>
	`;
	
	virtualDoc.innerHTML = rootHTML;
	const root = virtualDoc.querySelector('.root');

	recursiveRender(serializedTree.root, root, serializedTree);

	return virtualDoc;	
}

function serialize() {
	const serial = {};
	serial.root = traverse('root');
	recursiveTraverse(serial.root, serial);
	return serial;
}

function traverse(id) {
	const element = document.querySelector(`#${id}`);
	const ul = [...element.children]
		.filter(x => x.localName === 'ul')[0];
	let children = [];

	if (ul) {
		children = [...ul.children]
			.filter(x => x.className === 'nodes')
			.map(child => child.id);
	}

	return children;
}

function recursiveTraverse(root, serial) {
	for (let i of root) {
		let temp = traverse(i);
		serial[i] = temp;
		recursiveTraverse(temp, serial);
	}
}

function recursiveRender(array, parent, serializedTree) {
	for (let i of array) {
		const title = currentData[i]['title'];
		const data = currentData[i]['data'];
		
		const node = document.createElement('div');
		node.classList.add(i);
		node.classList.add('nodes');
		node.innerHTML = `
			<h2 class='ql-align-justify title'>${currentData[i].title}</h2>
			${currentData[i].data}
		`;
		parent.appendChild(node);

		const children = serializedTree[i];
		recursiveRender(children, node, serializedTree);
	}
}

// PRINT THE DOC

const printBtn = document.querySelector('.print');

printBtn.addEventListener('click', print);

function print() {
	const virtualDoc = printDoc();

	const body = document.querySelector('body');
	const frame = document.createElement('iframe');
	frame.setAttribute('src', 'about:blank');
	frame.setAttribute('name', 'doc');
	body.appendChild(frame);
	const doc = window.frames['doc'];
	console.log(doc.document.documentElement);
	doc.document.head.innerHTML += `<title>Paper</title>
		<meta charset="UTF-8">
		<link href="quill.snow.css" rel="stylesheet">
		<style>
		${style}
		</style>
		`;
	doc.document.body.innerHTML += virtualDoc.outerHTML;
	console.log(doc.document.head.outerHTML);
	console.log(doc.document.body.outerHTML);
	doc.document.head.querySelector('link').addEventListener('load', () => {
		doc.window.focus();
		doc.window.print();
		body.removeChild(frame);
	});
}

// STYLES FOR THE PRINT

var style = `
	.ql-container.ql-snow {
		border: 0;
	}
	.ql-container, .ql-editor {
		overflow-y: visible;
		text-align: justify;
	}
`;