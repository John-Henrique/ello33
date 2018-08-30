$(function(){
	
	consulta = {
		
		query: function( strUrl, jsonData, callback, callback_error ){
			url = '';
			phonon.preloader( ".circle-progress" ).show();
			//console.log( "mostrando");
			
			
			if( jsonData.url != false ){
				url = config.api() + strUrl;
			}else{
				url = strUrl;
			}
			
			$.ajax({
				url: url,
				type: "GET", 
				data: jsonData,
				timeout: 10000
			}).done( function(response) {
					
				phonon.preloader( ".circle-progress" ).hide();
				//console.log( 'escondendo');
				
				//console.log( typeof( callback )  );
				
				if( typeof( callback ) == 'function' ){
					callback( response );
				}
				
				//return response;
					
			}).fail( function(x,t,m){
					
				phonon.preloader( ".circle-progress" ).hide();
				//console.log( 'escondendo');
				
				// sempre que a conexão estiver lenta
				if( t === "timeout" ){
					
					msg = "O servidor não respondeu dentro do tempo esperado.";
					n( msg, 10000, 'negative' );
					
				}else if(x.status == 404 || m == 'Not Found'){ 
					msg = "Nenhum conteúdo foi encontrado";
					//n( msg, 10000, 'negative' );

					if( typeof( callback_error ) == 'function' ){
						//callback_error( x.responseText );
					}
				}else{
					msg = "Falha, sua internet parece estar lenta";
					n( m.responseText, 10000, 'negative' );
				}
				
				
				if( typeof( callback_error ) == 'function' ){
					callback_error( msg );
				}
			});
		},
		
		send: function( strUrl, jsonData, callback, callback_error ){
			
			phonon.preloader( ".circle-progress" ).show();
			
			$.ajax({
				url: config.api() + strUrl,
				type: "POST", 
				data: jsonData,
				timeout: 30000
			}).done( function(response) {
					
				phonon.preloader( ".circle-progress" ).hide();
				
				console.log( response );
				
				if( typeof( callback ) == 'function' ){
					callback( response );
				}
				
				//return response;
					
			}).fail( function(x,t,m){
					
				phonon.preloader( ".circle-progress" ).hide();
				
				console.log( "erro" );
				console.log(x);
				console.log(t);
				console.log(m);
				
				// sempre que a conexão estiver lenta
				if( t === "timeout" ){
					
					msg = "O servidor não respondeu dentro do tempo esperado.";
					n( msg, 10000, 'negative' );
					
				}else if(x.status == 404 || m == 'Not Found'){ 
					//n( msg, 10000, 'negative' );

					if( typeof( callback_error ) == 'function' ){
						callback_error( x.responseText );
					}
				}else{
					//m = "Falha, sua internet parece estar lenta";
					n( m.responseText, 10000, 'negative' );
				}
			});
		},
		
		
		carregar_mais: function( tela, url ){
			// Simula um evento onScroll
			$( tela +' .content').scroll(function(){
				if( ( $( tela +' .content').scrollTop() + $( tela +' .content').height() ) > $(document).height() - 200 ){
					
					if( sessionStorage.getItem( 'carregando' ) != 1 ){
						phonon.notif( "Fim da página", 1000 );
						
						// consulta novos itens
						this.query( url, {}, function( content ){
							
							/**
							 * Se for encontrado algum item
							 * ele deverá ser adicionado no 
							 * final da lista existente em 
							 * .content
							 **/
							if( content ){
								$( tela +'.content' ).append( content );
							}
							
						}, function(){});
						sessionStorage.setItem( 'carregando', 1 );
					}
				}
			});
		}
	}
});