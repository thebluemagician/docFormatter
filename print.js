function printDoc() {
	const virtualDoc = document.createElement('div');
	const serializedTree = serialize();
	virtualDoc.classList.add('doc');
	const rootHTML = `
		<div class='root nodes'>
			<div class='title' id='main-title'>${currentData.root.title}</div>
			<div class='data meta-data'>
				${currentData.root.data}
			</div>
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
			<div class='title'>${currentData[i].title}</div>
			<div class='data'>
				${currentData[i].data}
			</div>
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
	doc.document.body.innerHTML += `
		${demoStyle}
	`;
	doc.document.body.appendChild(virtualDoc);

	// console.log(doc.document.body.innerHTML);
	doc.window.focus();
	doc.window.print();
	body.removeChild(frame);
}

// STYLES FOR THE PRINT

var demoStyle = `
	<style>
		html{
			background-color:#fff;
			margin:0px;
		}
		body{
			max-width:21.00cm;
			max-height:29.70cm;

			margin:5.2cm 4.401cm 5.2cm 4.401cm;			
			border:0px solid black;
			page-break-after:right;
		}
		@page{
			size:auto;
			margin:0mm;
		}
		/*
		body::first-line {
			font-size: 14px;
			font-weight: bold;
			text-decoration: none;
			text-align: right;
		} */
		.nodes {
			display: block;
			text-align: justify;
		}

		.nodes > .nodes {
			padding: 15px
            margin-left:0;
			padding-left:0;
		}

		.nodes .title {
			font-size: 12px;
			font-weight: bold;
		}

		.nodes .data {
			font-size: 10px;
			text-align:justify;
		}

		#main-title, .meta-data{
			font-weight:bold;
			font-size:14px;
			text-align:center;
			width:280px;
			margin:0 auto;
		}
		.meta-data>p{
			font-size:10px;
			font-weight:normal;
			text-align:center;
			margin-bottom:20px;
		}
	</style>
`;
