document.addEventListener('DOMContentLoaded', function() {
	// #resultを非表示にする
	document.querySelector('#result').style.display = 'none';
	if (document.querySelector('form#subscribe')) {
		document.querySelector('form#subscribe').addEventListener('submit', subscribe);
	}
	if (url('path') === '/unsubscribe.html') {
		const email = url('?email');
		if (email) {
			document.querySelector('#email').innerText = email;
			document.querySelector('[name="email"]').value = email;
		}
		document.querySelector('form#unsubscribe').addEventListener('submit', unSubscribe);
	}
	console.log();
});

const GAS_URL = 'https://script.google.com/macros/s/AKfycbxbgd8v7NuVp8-bZCsKcsKybpRzEiV8fJ4jZRcvPi21sTS5tOxpZAFlWISvqKiKD7HY/exec';

function getData(type, target) {
	const data = {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	};
	const body = new URLSearchParams();
	body.append('action', type);
	body.append('email', target.email.value);
	data.body = body;
	return data;
}

async function subscribe(e) {
	e.preventDefault();
	const data = getData('register', e.target);
	data.body.append('name', e.target.name.value);
	const bol = await post(data);
	const message = bol ? '登録しました' : '登録に失敗しました';
	const type = bol ? 'success' : 'warning';
	showMessage(message, type);
	e.target.reset();
}

async function post(data) {
	try {
		console.log(data);
		const res = await fetch(GAS_URL, data);
		const json = await res.json();
		return json.result;
	} catch (e) {
		console.error(e);
		return false;
	}
}

async function unSubscribe(e) {
	e.preventDefault();
	const data = getData('remove', e.target);
	const bol = await post(data);
	const message = bol ? '登録解除しました' : '登録解除に失敗しました';
	const type = bol ? 'success' : 'warning';
	showMessage(message, type);
	e.target.reset();
}

function showMessage(message, type) {
	const result = document.querySelector('#result');
	result.classList.remove('alert-success', 'alert-warning');
	result.classList.add('alert-' + type, 'show');
	result.innerHTML = message;
	result.style.display = 'block';
}