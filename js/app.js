document.addEventListener('DOMContentLoaded', function() {
	// #resultを非表示にする
	document.querySelector('#result').style.display = 'none';
	// 購読のDOMがあれば、そのイベントリスナーを設定
	if (document.querySelector('form#subscribe')) {
		document.querySelector('form#subscribe').addEventListener('submit', subscribe);
	}
	// 購読停止用のURLへのアクセスであれば、パラメーターとして渡されたメールアドレスをフォームにセット
	if (url('path') === '/unsubscribe.html') {
		const email = url('?email');
		if (email) {
			document.querySelector('#email').innerText = email;
			document.querySelector('[name="email"]').value = email;
		}
		// 購読停止のDOMがあれば、そのイベントリスナーを設定
		document.querySelector('form#unsubscribe').addEventListener('submit', unSubscribe);
	}
});

// GASのURL
const GAS_URL = 'https://script.google.com/macros/s/AKfycbxbgd8v7NuVp8-bZCsKcsKybpRzEiV8fJ4jZRcvPi21sTS5tOxpZAFlWISvqKiKD7HY/exec';

// GASへリクエストするためのデータを作成
function getData(type, target) {
	const data = {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	};
	// 購読・購読停止両方に共通するパラメーターを作成
	const body = new URLSearchParams();
	body.append('action', type);
	body.append('email', target.email.value);
	data.body = body;
	return data;
}

// 購読用のイベント
async function subscribe(e) {
	e.preventDefault();
	// リクエストデータの作成
	const data = getData('register', e.target);
	// 名前は購読時のみなので追加
	data.body.append('name', e.target.name.value);
	// fetchでGASにリクエスト
	const bol = await post(data);
	// 処理判定でメッセージを変える
	const message = bol ? '登録しました' : '登録に失敗しました';
	const type = bol ? 'success' : 'warning';
	// メッセージを表示
	showMessage(message, type);
	// フォームをリセット
	e.target.reset();
}

// GASにリクエストする処理
async function post(data) {
	try {
		const res = await fetch(GAS_URL, data);
		const json = await res.json();
		// リクエスト結果を返す
		return json.result;
	} catch (e) {
		console.error(e);
		return false;
	}
}

// 購読停止用イベント
async function unSubscribe(e) {
	e.preventDefault();
	// リクエストデータの作成
	const data = getData('remove', e.target);
	// fetchでGASにリクエスト
	const bol = await post(data);
	// 処理判定でメッセージを変える
	const message = bol ? '登録解除しました' : '登録解除に失敗しました';
	const type = bol ? 'success' : 'warning';
	// メッセージを表示
	showMessage(message, type);
	// フォームをリセット
	e.target.reset();
}

// メッセージを表示する処理
function showMessage(message, type) {
	const result = document.querySelector('#result');
	result.classList.remove('alert-success', 'alert-warning');
	result.classList.add('alert-' + type, 'show');
	result.innerHTML = message;
	result.style.display = 'block';
}