
  /**
  * everevo のイベント情報を探索するjsスクリプト
  *
  *
  */

  /** sync
  * サーバとの同期
  *
  */
  function sync(){
    jQuery.get('http://localhost/everio.json',function(json){
      ///現在判明しているイベント番号を取得
      var data = JSON.parse(json)
      console.log(data.finded)
      $('#currentEvent').html(data.finded);
    });
  }

  /** ローカルで最新とされたイベントのidを中央サーバに転送する
  * @param newCurrentEventId {Number} 最新のイベントid
  * return 最新id
  */
  function send(){
    var current = sessionStorage.current;
    var jsonData = { finished:current, time: "2pm" };
    $.post(
      "http://localhost/everio.php",
      jsonData,
      function(posted) {
        /// 最新のデータが帰ってくる
        $('#list').append(posted);
      }
    );
  }


  /** everevoからデータの取得
  * 現状の調査済番号をsessionStorageから取得して調査を再開する
  * 取得してみて取得が完了できたらStorageに記録
  */
  function renew(){
    var currentNumber = sessionStorage.current;
    currentNumber = parseInt(currentNumber)+1;
    console.log(currentNumber);
    if(isNaN(currentNumber)){
      currentNumber = 1;
    }
    var url = "http://everevo.com/event/"+currentNumber;
    var htmldata = $.ajax({
      url: url,
      async: false
    }).responseText;

    // スクレイプ処理
    var title = $('<div>'+htmldata+'</div>').find('meta[property="og:title"]').attr('content');
    var description = $('<div>'+htmldata+'</div>').find('meta[property="og:description"]').attr('content');

    if(title != undefined){
      storage_currentnumber(currentNumber);
    }else{
      storage_stocks(currentNumber+1);
      storage_currentnumber(currentNumber);
      $('#currentEvent').html(currentNumber+1);
    }
  }

  /** storage_stocksはsessionStorageでの扱いとなる
  * 入ってきたid {number}をストレージに格納する
  * currentにも保存する
  * @param id {Number} 存在が確認されたeverevoイベントid
  * @return 1 {Bool} 格納完了後に1を返す idがNaNなら未処理で0を返す
  */
  function storage_stocks(id){
    var stocks = [];

    if( isNaN(id) ){ return 0; }
    if (sessionStorage['stocks']){ stocks = JSON.parse(sessionStorage['stocks']); }

    stocks.push(id);
    sessionStorage.stocks=JSON.stringify(stocks);
    //alert(sessionStorage.stocks);
    return 1;
  }

  /** storage_currentnumberはsessionStorageでの扱いとなる
  * 入ってきたid {number}をストレージに格納する
  * currentにも保存する
  * @param id {Number} 存在のいかんに問わず調査済みのidが格納される
  * @return 1 {Bool} 格納完了後に1を返す idがNaNなら未処理で0を返す
  */
  function storage_currentnumber(id){
    var stocks = [];
    if( isNaN(id) ){ return 0; }
    sessionStorage.current=id;
    return 1;
  }

