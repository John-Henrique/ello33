var database = null;

function initDatabase() {
	database = window.sqlitePlugin.openDatabase({name: config.db() +'.db', location: 'default'});
	criaTabelas();
}


function criaTabelas(){
		
		/**
		 * GRUPOS
		 * */
		database.sqlBatch([
			'CREATE TABLE IF NOT EXISTS grupos ( id INTEGER NOT NULL , nome VARCHAR(30) NOT NULL , imagem VARCHAR , criado DATETIME NOT NULL , PRIMARY KEY(id));',
			//[ 'INSERT INTO rotinas VALUES (?,?,?,?,?,?,?)', ['1','1','1','1','10','Reps','0'] ],
		], function() {
			console.log('grupos OK');
		}, function(error) {
			console.log('SQL batch ERROR: ' + error.message);
		});
		
		
		/**
		 * CONTATOS
		 * */
		database.sqlBatch([
			'CREATE TABLE IF NOT EXISTS contatos ( id INTEGER NOT NULL , nome VARCHAR(40) NOT NULL , telefone INTEGER(12) NOT NULL , imagem VARCHAR , geolocalizacao VARCHAR , endereco VARCHAR , criado DATETIME , PRIMARY KEY(id));',
			//[ 'INSERT INTO exercicios VALUES (?,?,?,?,?,?,?)', ['1','1','3','Agachamento sumô','bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla','sumo.jpg','sumo.mp4'] ],
		], function() {
			console.log('contatos OK');
		}, function(error) {
			console.log('SQL batch ERROR: ' + error.message);
		});
		
		
		/**
		 * PARTICIPANTES
		 * */
		database.sqlBatch([
			'CREATE TABLE IF NOT EXISTS participantes ( id INTEGER NOT NULL , grupos_id INTEGER NOT NULL , contatos_id INTEGER NOT NULL , PRIMARY KEY(id, grupos_id, contatos_id) , FOREIGN KEY(grupos_id) REFERENCES grupos(id) ON DELETE NO ACTION ON UPDATE NO ACTION, FOREIGN KEY(contatos_id) REFERENCES contatos(id) ON DELETE NO ACTION ON UPDATE NO ACTION); CREATE INDEX participantes_FKIndex1 ON participantes (grupos_id); CREATE INDEX participantes_FKIndex2 ON participantes (contatos_id); CREATE INDEX IFK_Rel_01 ON participantes (grupos_id); CREATE INDEX IFK_Rel_04 ON participantes (contatos_id);',
			//['INSERT INTO participantes VALUES (?,?,?,?)', ['1', 'Corpo inteiro', '1530862662-triceps.jpg', '1'] ], 
		], function() {
			console.log('participantes OK');
		}, function(error) {
			console.log('SQL batch ERROR: ' + error.message);
		});
		
		
		/**
		 * MENSAGENS
		 * */
		database.sqlBatch([
			'CREATE TABLE IF NOT EXISTS mensagens ( id INTEGER NOT NULL , contatos_id INTEGER NOT NULL , grupos_id INTEGER , destino_id INTEGER NOT NULL , tipo VARCHAR(15) NOT NULL , texto VARCHAR NOT NULL , situacao SMALLINT NOT NULL DEFAULT 0 , enviada DATETIME NOT NULL , recebida DATETIME , lida DATETIME , favorito SMALLINT , situacao_pedido SMALLINT , PRIMARY KEY(id) , FOREIGN KEY(contatos_id) REFERENCES contatos(id) ON DELETE NO ACTION ON UPDATE NO ACTION, FOREIGN KEY(grupos_id) REFERENCES grupos(id) ON DELETE NO ACTION ON UPDATE NO ACTION); CREATE INDEX mensagens_FKIndex1 ON mensagens (contatos_id); CREATE INDEX mensagens_FKIndex2 ON mensagens (grupos_id); CREATE INDEX IFK_Rel_05 ON mensagens (contatos_id); CREATE INDEX IFK_Rel_06 ON mensagens (grupos_id);',
			//[ 'INSERT INTO mensagens VALUES (?,?,?)', ['1','Iniciante','1'] ],
		], function() {
			console.log('mensagens OK');
		}, function(error) {
			console.log('SQL batch ERROR: ' + error.message);
		});
	
	}
	
	
	
	
/**
 * CONSULTA AVANÇADA
 * @since 2018-02-26
 * getAll( 'contatos', 'WHERE campo = ? AND nome LIKE ? ORDER BY id ASC', {1,'john'}, function( res ){
 * 		console.log( res );
 * });
 * */
function getAll( strTable, sql, valores, callback ){

    database.transaction(function (tx) {
		
		var query = select( strTable, null, order );
		
		query += sql;
		
		console.log( query );
		
        tx.executeSql(query, valores, function (tx, resultSet) {
			
			if( typeof( callback ) == 'function' ){
				callback( resultSet.rows );
			}
        },
        function (tx, error) {
            console.log('SELECT getAll error: ' + error.message);
        });
		
    }, function (error) {
        console.log('transaction getAll error: ' + error.message);
    }, function () {
        //console.log('transaction getData ok');
    });
}




/**
 * CONSULTA GERAL
 * @since 2018-02-26
 * */
function getData( strTable, rWhere, order, callback ) {

    database.transaction(function (tx) {
		
        var query = select( strTable, rWhere, order );
		
		console.log( query );
		
		if( typeof( query[1] ) == 'object' ){
			where = [query[1]];
		}else{
			where = [];
		}
		
        tx.executeSql(query[0], where, function (tx, res) {
			
			if( typeof( callback ) == 'function' ){
				callback( res );
			}
        },
        function (tx, error) {
            console.log('SELECT getData error: ' + error.message);
        });
    }, function (error) {
        console.log('transaction getData error: ' + error.message);
    }, function () {
        //console.log('transaction getData ok');
    });
}


/**
 * CONSULTA MENSAGENS PRIVADO
 * @since 2018-08-21
 * */
function getMsgPrivado( objParticipantes, callback ) {
	
	strTable = 'mensagens';
	
    database.transaction(function (tx) {
		
        var query = 'SELECT * FROM '+ strTable +' WHERE [contatos_id] IN('+ objParticipantes +') AND [destino_id] IN('+ objParticipantes +') ORDER BY enviada ASC';
		var where = '';
		
		console.log( query );
		
		
        tx.executeSql(query, where, function (tx, res) {
			
			if( typeof( callback ) == 'function' ){
				callback( res );
			}
        },
        function (tx, error) {
            console.log('SELECT getData error: ' + error.message);
        });
    }, function (error) {
        console.log('transaction getData error: ' + error.message);
    }, function () {
        //console.log('transaction getData ok');
    });
}



/**
 * ATUALIZA GERAL
 * @since 2018-02-26
 * */
function updateData( strTable, fields, where, callback ){
	
	// UPDATE Cars SET Name='Skoda Octavia' WHERE Id=3;
	database.transaction(function (tx) {
			
		query = update( strTable, fields, where );
		
		console.log( query );
		
		tx.executeSql(query[0], query[1], function(tx, res){
			
			console.log("insertId: " + res.insertId);
			console.log("rowsAffected: " + res.rowsAffected);
			
			if( typeof( callback ) == 'function' ){
				callback( res );
			}
		},
		function(tx, error) {
			console.log('UPDATE error: ' + error.message);
		});
	}, function(error) {
		console.log('transaction error: ' + error.message);
	}, function() {
		//console.log('transaction ok');
	});
}



/**
 * INSERIR DADO
 * @since 2018-02-26
 * */
function insertData( strTable, fields, callback ){
	
	// INSERT Cars SET Name='Skoda Octavia';
	database.transaction(function (tx) {
			
		query = insert( strTable, fields );
		
		console.log( query );
		
		tx.executeSql(query[0], query[1], function(tx, res){
			
			console.log("insertId: " + res.insertId);
			console.log("rowsAffected: " + res.rowsAffected);
			
			if( typeof( callback ) == 'function' ){
				callback( res.insertId );
			}
		},
		function(tx, error) {
			console.log('INSERT error: ' + error.message);
		});
	}, function(error) {
		console.log('transaction INSERT error: ' + error.message);
	}, function() {
		//console.log('transaction ok');
	});
}



function deteleData( tblName, where, callback ) {

    db.transaction(function (tx) {

        var query = remove( tblName, where );

        tx.executeSql(query[0], query[1], function (tx, res) {
            console.log("removeId: " + res.insertId);
            console.log("rowsAffected: " + res.rowsAffected);
			
			
			if( typeof( callback ) == 'function' ){
				callback( res );
			}
        },
        function (tx, error) {
            console.log('DELETE error: ' + error.message);
        });
    }, function (error) {
        console.log('transaction error: ' + error.message);
    }, function () {
        console.log('transaction ok');
    });
}	
	
		
	
	
	/**
	 * Auxiliar para criação de query
	 * */
	function Left(str, n) {
		// return a left part of a string
		var s = str + '';
		var iLen = s.length;
		if (n <= 0) {
			return "";
			} else if (n >= iLen) {
			return str;
			} else {
			return s.substr(0, n);
		}
	}


	/**
	 * Auxiliar para criação de query
	 * */
	function Len(str) {
		// return the length of a string
		if (typeof (str) === 'object') {
			return str.length;
		}
		str += '';
		return str.length;
	}
	
	
	
	/**
	 * tblName informa o nome da tabela a trabalhar
	 * tblRecord array com o nome dos campos a trabalhar
	 * */
	function insert( tblName, tblRecord ){
		/*
		tblRecord = {};
		tblRecord.name = "John";
		tblRecord.numero = 0215463;
		tblRecord.type = 'null';
		tblName = 'tabela';
		*/
		
		// fields are passed as parameters
		var qry = '', flds = "", vals = "", avals = [];
		for (var key in tblRecord) {
			flds += "[" + key + "],";
			vals += "?,";
			avals.push(tblRecord[key]);
		}
		flds = Left(flds, Len(flds) - 1);
		vals = Left(vals, Len(vals) - 1);
		qry = "INSERT INTO [" + tblName + "] (" + flds + ") VALUES (" + vals + ");";
		/*
		console.log( qry );
		console.log( avals );
		console.log( tblRecord );
		 * */
		//Execute(db, qry, avals);
		return [qry,avals];
	}
	
	
	/**
	 *	var rWhere = {};
		rWhere.FullName = "Anele Mbanga";
		order = 'field ASC'
		select( "Contacts", rWhere, order);
	 * */
	function select( tblName, tblWhere, order ){
		// code to get a record from database using a where clause
		// tblWhere should be objects
		var qry = "", vals = "", avals = [];
		for (item in tblWhere) {
			vals += "[" + item + "] = ? AND ";
			avals.push(tblWhere[item]);
		}
		vals = Left(vals, Len(vals) - 5);
		//console.log(avals);
		if( tblWhere != undefined ){
			vals = " WHERE " + vals + " ";
		}else{
			avals = '';
		}
		
		if( ( order != undefined ) && ( order != '' ) ){
			//console.log( order );
			vals = vals +' ORDER BY '+ order;
		}
		
		//console.log(avals);
		qry = "SELECT * FROM [" + tblName + "] "+ vals +" ;";
		//Execute(db, qry, avals);
		return [qry,avals];
	}
	
	
	
	/**
	 var tblRecord = {}, tblWhere = {};
	tblRecord.MobileNumber = 98765432
	tblRecord.FullName = "Anele Mbanga";
	updateWhere( "Contacts", tblRecord, tblWhere);
	 * */
	function update( tblName, tblRecord, tblWhere) {
		// code to update a record on a database
		// tblRecord and tblWhere should be objects
		var qry = "", vals = "", wvals = "", avals = [];
		for (item in tblRecord) {
			vals += "[" + item + "] = ?,";
			avals.push(tblRecord[item]);
		}
		for (item in tblWhere) {
			wvals += "[" + item + "] = ? AND ";
			avals.push(tblWhere[item]);
		}
		vals = Left(vals, Len(vals) - 1);
		wvals = Left(wvals, Len(wvals) - 5);
		qry = "UPDATE [" + tblName + "] SET " + vals + " WHERE " + wvals + ";";
		//return Execute(db, qry, avals);
		return [qry,avals];
	}
	
	
	/*
	var dR = {};
	dR.FullName = "Anele Mbanga";
	deleteWhere( "Contacts", dR);
	 * */
	function remove( tblName, tblWhere) {
		// delete a record from a table using a where clause
		// pass the where fields as parameters
		var qry = "", wvals = "", avals = [];
		for (item in tblWhere) {
			wvals += "[" + item + "] = ? AND ";
			avals.push(tblWhere[item]);
		}
		// remove last ' AND '
		wvals = Left(wvals, Len(wvals) - 5);
		qry = "DELETE FROM [" + tblName + "] WHERE " + wvals + ";";
		//return Execute(db, qry, avals);
		return [qry,avals];
	};


function echoTest() {
  window.sqlitePlugin.echoTest(function() {
    navigator.notification.alert('Echo test OK');
  }, function(error) {
    navigator.notification.alert('Echo test ERROR: ' + error.message);
  });
}

function selfTest() {
  window.sqlitePlugin.selfTest(function() {
    navigator.notification.alert('Self test OK');
  }, function(error) {
    navigator.notification.alert('Self test ERROR: ' + error.message);
  });
}

function reload() {
  location.reload();
}

function stringTest1() {
  database.transaction(function(transaction) {
    transaction.executeSql("SELECT upper('Test string') AS upperText", [], function(ignored, resultSet) {
      navigator.notification.alert('Got upperText result (ALL CAPS): ' + resultSet.rows.item(0).upperText);
    });
  }, function(error) {
    navigator.notification.alert('SELECT count error: ' + error.message);
  });
}

function stringTest2() {
  database.transaction(function(transaction) {
    transaction.executeSql('SELECT upper(?) AS upperText', ['Test string'], function(ignored, resultSet) {
      navigator.notification.alert('Got upperText result (ALL CAPS): ' + resultSet.rows.item(0).upperText);
    });
  }, function(error) {
    navigator.notification.alert('SELECT count error: ' + error.message);
  });
}

function showCount() {
  database.transaction(function(transaction) {
	  
    transaction.executeSql('SELECT count(*) AS recordCount FROM contatos', [], function(ignored, resultSet) {
      console.log('contatos COUNT: ' + resultSet.rows.item(0).recordCount);
    });
	
    transaction.executeSql('SELECT count(*) AS recordCount FROM grupos', [], function(ignored, resultSet) {
      console.log('grupos COUNT: ' + resultSet.rows.item(0).recordCount);
    });
	
    transaction.executeSql('SELECT count(*) AS recordCount FROM participantes', [], function(ignored, resultSet) {
      console.log('participantes COUNT: ' + resultSet.rows.item(0).recordCount);
    });
	
    transaction.executeSql('SELECT count(*) AS recordCount FROM mensagens', [], function(ignored, resultSet) {
      console.log('mensagens COUNT: ' + resultSet.rows.item(0).recordCount);
    });
	
	data = sessionStorage.getItem( 'data' );//AND STRFTIME( "%Y-%m-%d", post_date )="'+ data +'
    transaction.executeSql('SELECT * FROM mensagens ORDER BY enviada ASC ', [], function(ignored, res) {
		quantidade = res.rows.length;
		if( quantidade > 0 ){
			
			html = '';
			
			for( i=0; i < quantidade; i++ ){
				
				html = html +"<li>autor "+ res.rows.item( i ).contatos_id +' destino '+ res.rows.item( i ).destino_id +' '+ res.rows.item( i ).texto +"</li>";
			}
			
			$( '.registros' ).html( html );
		}
		
    });
	
	
  }, function(error) {
    navigator.notification.alert('SELECT count error: ' + error.message);
  });
}

function addRecord() {
  database.transaction(function(transaction) {
    transaction.executeSql('INSERT INTO pl_options VALUES (NULL, ?,?, datetime( "now","localtime") )', ['User '+nextUser, nextUser]);
  }, function(error) {
    navigator.notification.alert('INSERT error: ' + error.message);
  }, function() {
    navigator.notification.alert('INSERT OK');
    ++nextUser;
  });
}

function addJSONRecordsAfterDelay() {
  function getJSONObjectArray() {
    var COUNT = 100;
    var myArray = [];

    for (var i=0; i<COUNT; ++i) {
      myArray.push({name: 'User '+nextUser, score: nextUser});
      ++nextUser;
    }

    return myArray;
  }

  function getJSONAfterDelay() {
    var MY_DELAY = 150;

    var d = $.Deferred();

    setTimeout(function() {
      d.resolve(getJSONObjectArray());
    }, MY_DELAY);

    return $.when(d);
  }

  // NOTE: This is similar to the case when an application
  // fetches the data over AJAX to populate the database.
  // IMPORTANT: The application MUST get the data before
  // starting the transaction.
  //tx.executeSql('INSERT INTO pl_posts (post_type, post_title, post_status) VALUES (?,?,?)', ['atividades', 'Estudo', 'publish']);
  getJSONAfterDelay().then(function(jsonObjectArray) {
    database.transaction(function(transaction) {
      $.each(jsonObjectArray, function(index, recordValue) {
        transaction.executeSql('INSERT INTO pl_posts (post_title, post_content, post_status, post_type) VALUES (?,?,?,?)',
          [recordValue.name, recordValue.score, 'publish', 'diario' ]);
      });
    }, function(error) {
      navigator.notification.alert('ADD records after delay ERROR '+ error.message );
    }, function() {
      navigator.notification.alert('ADD 100 records after delay OK');
    });
  });
}

function deleteRecordsFromCpt( tbl ) {
  database.transaction(function(transaction) {
    transaction.executeSql('DELETE FROM '+ tbl );
  }, function(error) {
    navigator.notification.alert('DELETE error: ' + error.message);
  }, function() {
    navigator.notification.alert('DELETE '+ cpt +' OK');
  });
}


function deleteRecords() {
  database.transaction(function(transaction) {
    transaction.executeSql('DELETE FROM pl_posts');
    transaction.executeSql('DELETE FROM pl_options');
    transaction.executeSql('DELETE FROM pl_postmeta');
  }, function(error) {
    navigator.notification.alert('DELETE error: ' + error.message);
  }, function() {
    navigator.notification.alert('DELETE OK');
    ++nextUser;
  });
}


function deleteDatabase(){
	window.sqlitePlugin.deleteDatabase({name: "diariodosono.db", location: 'default'}, function(){
		navigator.notification.alert('SQLite: DATABASE DELETED');
	}, function( error ){
		navigator.notification.alert("DELETE error:  "+ error.code +" : "+ error.message );
	});
}

function nativeAlertTest() {
  navigator.notification.alert('Native alert test message');
}

function goToPage2() {
  window.location = "page2.html";
}

