/*
  style_script.js
                                                             Younosuke FURUI

【使用方法】
  <script type="text/javascript" src="style_script.js"></script> または
  <script type="text/javascript" src="../style_script.js?docLevel=1"></script>
  <script type="text/javascript" src="../../style_script.js?docLevel=2"></script>

・トップディレクトリをレベル0、その直下のサブディレクトリをレベル1として、
  レベル0以外では必ず docLevel=x というパラメータを記述すること。

・style_script.js そのものはレベル0以外の場所にあっても構わない。

・トップページはレベル0のデフォルトファイル(index.*)とすること。

・各ディレクトリにデフォルトファイルが存在し、それを同ディレクトリ内にある
  他ページからの「戻る」のリンク先にすることができること。

・共通ヘッダや共通リンクメニューを表示するためには次の要素が必要。
  要素が無ければ単に表示されない。
  - ヘッダ:   <header id="common-header"></header>
  - メニュー: <nav id="common-nav"></nav>
  - フッタ:   <footer id="common-footer"></footer>

・本スクリプト内に記述するパス名は次のいずれかであること。
  - レベル0からの相対パス
  - サイト内ルートすなわち'/'から始まる絶対パス
  - 'http://'もしくは'https://'から始まるURL

・相対パスを使う限り、Webサーバ経由で閲覧してもファイルを直接開いても、
  同じように閲覧することができる……はずだが徹底的に検証したわけではない。

・ファイルではなくディレクトリを指す相対パスの記述は次のいずれかであること。
  - 空文字列 ... トップディレクトリ（＝レベル0）
  - その他 ... 区切りおよび終端が'/' ※バックスラッシュ、円記号は不可

・本スクリプト内に記述する表示テキストやURLはエンコード済みであること。
  (NG) There's no place like home.
  (OK) There&#39;s no place like home.

・本スクリプトが生成するリンクをGoogleのロボットは見つけてくれないので、
  Google検索に引っかかるようにしたかったら別の工夫をすること。
  Googleコンソールを使うとか、ページ内にもリンクを書くとか。
*/

/*---------- 設定値 ----------*/

/* 設定の配列 */
var docEnv = {};

/* トップページ名、その他のデフォルトページ名 */
docEnv['top.name'] = 'index.html';
docEnv['default.name'] = 'index.html';
/* docEnv['default.map'] = {
  'jdk/' : 'index.html',     //default.nameと同名なら設定を書かなくてもいいが
  'eclipse/' : 'index.html', //設定例として残す。
  'foo/' : 'index.htm',
  'bar/' : 'default.htm'
}; */

/* スタイル、アイコン */
docEnv['common.style'] = [ 'style-base.css', 'style-mjava.css' ];
docEnv['common.icon'] = 'https://mihirakijava.github.io/support/mjava.ico';

/* 共通ヘッダ */
//docEnv['common.head.image'] = 'header image file';
//docEnv['common.head.alt'] = 'alternative text';
docEnv['common.head.text'] = '「見ひらきで学べるJavaプログラミング」サポート';

/* 著作権表示 ※共通ヘッダとmetaタグの両方に使われる */
docEnv['common.copyright'] = '&copy; 2019 古井陽之助, 神屋郁子, 下川俊彦, 合志和晃.';

/* 共通フッタに表示する、戻りリンク以外のリンク */
docEnv['common.foot.links'] = {
  'https://www.kindaikagaku.co.jp/': '近代科学社',
  //'https://www.kindaikagaku.co.jp/support.htm': 'サポート情報一覧',
  'https://www.kindaikagaku.co.jp/book_list/detail/9784764905979/': '書籍情報'
};

/* 戻りリンクのラベル */
docEnv['common.label.to_top'] = 'トップ';
docEnv['common.label.to_index'] = '戻る';

/* 共通リンクメニュー */
docEnv['common.menu'] = {
  'index.html' : 'トップ',
  'eclipse.html' : 'Eclipse',
  'eclipse' : {
    'eclipse2022.html' : 'Eclipse 2022以降',
    'eclipse2019.html' : 'Eclipse 2021以前',
    'font.html' : 'フォント'
  },
  'jdk.html' : 'JDK',
  'jdk' : {
    'jdk18.html' : 'JDK 18以降',
    'jdk12.html' : 'JDK 17以前',
    'encoding.html' : '文字化けについて'
  }
};
/* docEnv['common.menu'] = {
  'index.html' : 'トップ',
  'eclipse/index.html' : 'Eclipse',
  'eclipse' : {
    'eclipse/eclipse2022.html' : 'Eclipse 2022以降',
    'eclipse/eclipse2019.html' : 'Eclipse 2021以前',
    'eclipse/font.html' : 'フォント'
  },
  'jdk/index.html' : 'JDK',
  'jdk' : {
    'jdk/jdk18.html' : 'JDK 18以降',
    'jdk/jdk12.html' : 'JDK 17以前',
    'jdk/encoding.html' : '文字化けについて'
  },
  'bar/default.htm' : 'Bar',
  'bar' : {
    'bar/index.html' : 'index',
    'bar/test.html' : 'test'
  }
}; */


/*---------- head要素内で実行する処理 ----------*/

setDocEnv();               //文書に関する変数を設定
writeHeadContent();        //head要素内を出力
setOnLoad(outCommonParts); //onloadイベントで共通要素を出力するよう設定


/*---------- 汎用関数の宣言 ----------*/

/* 関数: basename */
function basename(s){
  var pos = s.lastIndexOf('/');
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

/* 関数: isMap */
function isMap(s){
  //not strictly right but enough
  return s != null && typeof(s) == "object" && !Array.isArray(s);
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
  docEnv['script.params'] = {};
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

  //page.parent
  docEnv['page.parent'] = dirname(location.pathname);

  //page.level
  docEnv['page.level'] = 0;
  if(docEnv['script.params']['docLevel'] != null){
    docEnv['page.level'] = parseInt(docEnv['script.params']['docLevel']);
  }

  //page.parent.relative
  docEnv['page.parent.relative'] = '';
  var par = docEnv['page.parent'];
  for(var i = 0; i < docEnv['page.level']; i++){
    var dir = basename(par);
    par = dirname(par);
    docEnv['page.parent.relative'] = dir + '/' + docEnv['page.parent.relative'];
  }

  //page.name, page.relative
  docEnv['page.name'] = basename(location.pathname);
  if(docEnv['page.name'] == ''){
    docEnv['page.name'] = getDefaultName(docEnv['page.parent.relative']);
  }
  docEnv['page.relative'] = docEnv['page.parent.relative'] + docEnv['page.name'];
}

/* 関数: レベル0からの相対パスを現行ディレクトリからの相対パスに変換 */
function buildPath(s){
  if(s.substring(0, 1) == '/'
  || s.substring(0, 7) == 'http://'
  || s.substring(0, 8) == 'https://'){
    return s;
  }

  if(s == '' && docEnv['page.level'] == 0){
    return './';
  }

  for(var i = 0; i < docEnv['page.level']; i++){
    s = '../' + s;
  }
  return s;
}

/* 関数: 指定されたディレクトリのデフォルトファイル名を返す
  （注意）
   ・引数はレベル0からの相対パスであること。
   ・返却値は相対パスではなくファイル名のみ。 */
function getDefaultName(p){
  //check the argument
  if(p === null){
    p = docEnv['page.parent.relative'];
  }

  if(p == ''){
    return docEnv['top.name'];
  }
  if(isMap(docEnv['default.map'])){
    var idx = docEnv['default.map'][p];
    if(idx != null){
      return idx;
    }
  }
  if(docEnv['default.name'] != null){
    return docEnv['default.name'];
  }else{
    return '';
  }
}

/* 関数: レベル0からの相対パス2個を比較して真理値を返す */
function comparePaths(p1, p2){
  var p1, p2
  if(p1 == '' || p1.slice(-1) == '/'){
    p1 += getDefaultName(p1);
  }
  if(p2 == '' || p2.slice(-1) == '/'){
    p2 += getDefaultName(p2);
  }
  return p1 == p2;
}

/* 関数: head要素内を出力 */
function writeHeadContent(){
  /* wow, still making efforts to support IE */
  //var ie9html5 = 'http://html5shim.googlecode.com/svn/trunk/html5.js';
  var ie9html5 = buildPath('html5.js');

  document.writeln('<meta name="viewport" content="width=device-width,init-scale=1.0">');
  document.writeln('<meta name="copyright" content="' + docEnv['common.copyright'] + '">');
  document.writeln('<meta http-equiv="Content-Style-Type" content="text/css">');
  document.writeln('<meta http-equiv="Content-Script-Type" content="text/javascript">');
  document.writeln('<!--[if lt IE 9]>');
  document.writeln('<script type="text/javascript" src="' + ie9html5 + '"></script>');
  document.writeln('<![endif]-->');
  if(typeof(docEnv['common.style']) == 'string'){
    document.writeln('<link rel="stylesheet" type="text/css" href="'
                     + buildPath(docEnv['common.style']) + '">');
  }else{
    for(var i = 0; i < docEnv['common.style'].length; i++){
      document.writeln('<link rel="stylesheet" type="text/css" href="'
                       + buildPath(docEnv['common.style'][i]) + '">');
    }
  }
  document.writeln('<link rel="icon" href="' + buildPath(docEnv['common.icon'])
                   + '">');
}

/* 関数: 共通ヘッダ、メニュー、フッタを所定の要素内に出力 */
function outCommonParts(){
  var ch = document.getElementById('common-header');
  if(ch != null){
    ch.innerHTML = makeCommonHeader();
  }

  var cm = document.getElementById('common-nav');
  if(cm != null){
    cm.innerHTML = makeCommonMenu();
  }

  var cf = document.getElementById('common-footer');
  if(cf != null){
    cf.innerHTML = makeCommonFooter();
  }
}

/* 関数: 共通ヘッダを出力 */
function makeCommonHeader(){
  var head = '<h1 id="common-masthead"><a href="' + buildPath(docEnv['top.name']) + '">';
  if(docEnv['common.head.image'] != null){
    head += '<img src="' + buildPath(docEnv['common.head.image']) + '"';
    if(docEnv['common.head.alt'] != null){
      head += ' alt="' + docEnv['common.head.alt'] + '"';
    }
    head += '>'
  }else if(docEnv['common.head.text'] != null){
      head += docEnv['common.head.text'];
  }else if(docEnv['common.head.alt'] != null){
    head += docEnv['common.head.alt'];
  }else{
    //seems something bad happened
    head += 'Oops!';
  }
  head += '</a></h1>';
  if(docEnv['common.copyright'] != null){
    head += '<p style="text-align: right;" id="common-copyright"><small>'
          + docEnv['common.copyright'] + '</small></p>';
  }
  return head;
}

/* 関数: 共通メニューを出力 */
function makeCommonMenu(){
  if(docEnv['common.menu'] != null){
    return makeOneMenu(docEnv['common.menu'], 'mainmenu');
  }else{
    //seems something bad happened
    return 'Oops!';
  }
}

function makeOneMenu(menu_obj, class_name){
  var tags;
  if(class_name != null){
    tags = '<ul class="' + class_name + '">';
  }else{
    tags = '<ul>';
  }

  for(var i in menu_obj){
    if(typeof(menu_obj[i]) == 'string'){
      tags += '<li>';
      if(comparePaths(i, docEnv['page.relative'])){
        tags += '<span id="current-page">' + menu_obj[i] + '</span>';
      }else{
        tags += '<a href="' + buildPath(i) + '">' + menu_obj[i] + '</a>';
      }
    }else{
      tags += makeOneMenu(menu_obj[i], 'submenu');
    }
  }

  tags += '<li class="endmark"></ul>'
  return tags;
}

/* 関数: 共通フッタを出力 */
function makeCommonFooter(){
  var footlinks = {};

  //サイト内への戻りリンク
  if(docEnv['page.level'] == 0){
    if(docEnv['page.name'] != docEnv['top.name']){
      footlinks[buildPath(docEnv['top.name'])] = docEnv['common.label.to_top'];
    }
  }else{
    var dn = getDefaultName(docEnv['page.parent.relative']);
    if(docEnv['page.name'] != dn){
      footlinks['./' + dn] = docEnv['common.label.to_index'];
    }
    footlinks[buildPath(docEnv['top.name'])] = docEnv['common.label.to_top'];
  }

  //その他のリンク
  if(isMap(docEnv['common.foot.links'])){
    for(var i in docEnv['common.foot.links']){
      footlinks[i] = docEnv['common.foot.links'][i];
    }
  }

  if(Object.keys(footlinks).length == 0){
    //seems something bad happened
    return 'Oops!';
  }

  var s = '[ ';
  var count = 0;
  for(var i in footlinks){
    if(count++ > 0){
      s += " | ";
    }
    s += '<a href="' + i + '">' + footlinks[i] + '</a>';
  }
  s += ' ]';
  return s;
}
