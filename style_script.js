/*---------- 設定値 ----------*/

/* 設定の配列 */
var docEnv = new Array();

/* スタイル */
docEnv['page.style'] = [ 'style-base.css', 'style-mjava.css' ];

/* アイコン */
docEnv['page.icon'] = 'https://you-furui.github.io/my-test/mjava.ico';

/* フッターに表示するリンク */
docEnv['footer.links'] = {
  'https://www.kindaikagaku.co.jp/support.htm': '近代科学社のサポートページに戻る'
};

/*---------- head要素内で実行する処理 ----------*/

setDocEnv();               //文書に関する変数を設定
writeHeadContent();        //head要素内を出力
setOnLoad(setCommonFooter);


/*---------- 汎用関数の宣言 ----------*/

/* 関数: basename */
function basename(s){
  pos = s.lastIndexOf('/');
  if(pos == -1){
    pos = s.lastIndexOf('\\');
  }
  if(pos >= 0){
    return s.substring(pos + 1);
  }else{
    return s;
  }
}

/* 関数: dirname */
function dirname(s){
  var pos = s.lastIndexOf('/');
  if(pos == -1){
    pos = s.lastIndexOf('\\');
  }
  if(pos >= 0){
    return s.substring(0, pos);
  }else{
    return '';
  }
}

/* 関数: buildPath */
function buildPath(s){
  if(docEnv['page.level'] > 0 && s.substring(0, 1) != '/'
  && s.substring(0, 7) != 'http://' && s.substring(0, 8) != 'https://'){
    for(var i = 0; i < docEnv['page.level']; i++){
      s = '../' + s;
    }
  }
  return s;
}

/* 関数: onloadにイベントハンドラを設定 */
function setOnLoad(func){
  if(window.addEventListener){
    window.addEventListener('load', func, false);
  }else
  if(window.attachEvent){ //for IE
    window.attachEvent('onload', func);
  }else{
    window.onload = func;
  }
}


/*---------- 各種関数の宣言 ----------*/

/* 関数: 文書に関する変数を設定 */
function setDocEnv(){
  //script.url
  var scripts = document.getElementsByTagName('script');
  docEnv['script.url'] = scripts[scripts.length - 1].src;

  //script.query
  var pos = docEnv['script.url'].indexOf('?');
  if(pos != -1){
    docEnv['script.query'] = docEnv['script.url'].substring(pos + 1);
  }else{
    docEnv['script.query'] = '';
  }

  //script.params
  var params = docEnv['script.query'].split('&');
  docEnv['script.params'] = new Array();
  for(var i = 0; i < params.length; i++){
    pos = params[i].indexOf('=');
    if(pos > 0){
      var key = params[i].substring(0, pos);
      var val = params[i].substring(pos + 1);
      docEnv['script.params'][key] = val;
    }else{
      docEnv['script.params'][params[i]] = '';
    }
  }

  //page.path
  docEnv['page.path'] = location.pathname;

  //page.name
  docEnv['page.name'] = basename(location.pathname);
  if(docEnv['page.name'] == ''){
    docEnv['page.name'] = 'index.html';
  }

  //page.parent
  docEnv['page.parent'] = dirname(location.pathname);

  //page.level
  docEnv['page.level'] = 0;
  if(docEnv['script.params']['docLevel'] != null){
    docEnv['page.level'] = parseInt(docEnv['script.params']['docLevel']);
  }

  //page.relative
  docEnv['page.relative'] = docEnv['page.name'];
  var par = docEnv['page.parent'];
  for(var i = 0; i < docEnv['page.level']; i++){
    var dir = basename(par);
    par = dirname(par);
    docEnv['page.relative'] = dir + '/' + docEnv['page.relative'];
  }
}

/* 関数: head要素内を出力 */
function writeHeadContent(){
  var ie9html5 = 'http://www.is.kyusan-u.ac.jp/~furui/html5.js';
  //var ie9html5 = 'http://html5shim.googlecode.com/svn/trunk/html5.js';

  document.writeln('<meta name="viewport" content="width=device-width,init-scale=1.0">');
  document.writeln('<meta http-equiv="Content-Style-Type" content="text/css">');
  document.writeln('<meta http-equiv="Content-Script-Type" content="text/javascript">');
  document.writeln('<!--[if lt IE 9]>');
  document.writeln('<script type="text/javascript" src="' + ie9html5 + '"></script>');
  document.writeln('<![endif]-->');
  if(typeof(docEnv['page.style']) == 'string'){
    document.writeln('<link rel="stylesheet" type="text/css" href="'
                     + buildPath(docEnv['page.style']) + '">');
  }else{
    for(var i = 0; i < docEnv['page.style'].length; i++){
      document.writeln('<link rel="stylesheet" type="text/css" href="'
                       + buildPath(docEnv['page.style'][i]) + '">');
    }
  }
  document.writeln('<link rel="icon" href="' + buildPath(docEnv['page.icon'])
                   + '">');
}

/* 関数: footer要素内に表示 */
function setCommonFooter(){
  var cf = document.getElementById('common-footer');
  if(cf == null){
    return;
  }

  var count = 0;
  var menu = "[ ";

  for(var url in docEnv['footer.links']){
    //トップへ戻るリンクのアンカーはトップページでは出力しない
    if(docEnv['page.level'] == 0 && docEnv['page.name'] == url){
      continue;
    }

    //アンカーを一つ出力
    if(count++ > 0){
      menu += " | ";
    }
    menu += '<a href="' + buildPath(url) + '">' + docEnv['footer.links'][url] + '</a>';
  }

  //トップ以外への戻るリンクを出力
  if(docEnv['page.level'] > 0 && docEnv['page.name'].indexOf('index\.') != 0){
    menu += ' | <a href="./">戻る</a>';
  }else if(docEnv['page.level'] >= 2){
    menu += ' | <a href="../">戻る</a>';
  }

  menu += " ]";

  cf.innerHTML = menu;
}