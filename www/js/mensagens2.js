$(function(){
	
	mensagens = {
		
		
		init: function(){
			
			$( 'textarea.responder' ).css( 'line-height', '56px;' );
			$( document ).on( 'focus', 'textarea.responder', function(){
				$( this ).css( 'line-height', '16px;' ).val('');
				//console.log( "line height modificado");
			});
			
			
			$( document ).on( 'click', '.mensagens-resposta', function(){
				mensagens.responder( this );
				//console.log( "resposta" );
			});
			
			
			
			$( document ).on( 'click', '.mensagens-detalhes', function(){
				
				post_id = $( this ).attr( 'data-entrega' );
				
				mensagens.listar_mensagens( post_id );
			});
			

			
			
			
			
			// adicionando a primeira iteração
			$( document ).on( 'click', '.mensagens-add', function(){
				mensagens.adicionar();
			});
			
			
		},
		
		atualiza: function(){
			
			//console.log( "atualiza conteudo" );
			mensagens.listar_mensagens();
			
			// atualiza a cada 30 segundos
			setInterval( function(){
				mensagens.listar_mensagens();
				
				//console.log( "atualizando dados" );
				
			}, 30000 );
			
		},
		
		
	



		
		adicionar: function(){
			
			var div = '';
			var usuario = user.dados();
			var avatar 		= 'img/icon_perfil.png';
			
			
			phonon.preloader( '#carregando' ).show();
			
			$.ajax({
				url: config.api() +"/v1/mensagens/add/", 
				method: 'POST', 
				timeout: 10000,
				data: {
					app: 		"cnm", 
					email: 		usuario.email,
					mensagem: 	$( '#mensagem-elogio' ).val(), 
					titulo: 	$( '#titulo-elogio' ).val(), 
					user_id: 	usuario.id,
					nome: 		usuario.nome,
					login: 		usuario.login,
					unidade: 	usuario.unidade,
				}
			}).done(function(retorno){
				
				console.log( retorno );
				
				
				$( '#mensagem-elogio, #titulo-elogio' ).val('');
				
				phonon.panel( '#add-elogio' ).close();
				
				phonon.preloader( '#carregando' ).hide();
				
				
				
				mensagens.listar();
				
				
			}).fail(function( jxhr, status, statusText ){
				
				if( status === "timeout" ){
					phonon.alert( 'O servidor não está respondendo neste momento, tente novamente mais tarde.', "Problemas com a internet", true );
				}
				
				
				if( jxhr.status == 404 || statusText == 'Not Found' ){ 
					phonon.alert( JSON.parse( jxhr.responseText ).message, "Opss, temos um problema", true );
					
					$( '.mensagens-mensagens' ).html( "<h4 class='padded-top'>"+ JSON.parse( jxhr.responseText ).message +"</h4>" );
					//$( '.content' ).addClass( 'padded-full' );
				}
				
				phonon.preloader( '#carregando' ).hide();
			});
			
			
			div = '';
		},
		
		
		
		
		
		
		listar_mensagens: function( post_id ){
			
			var div = '';
			var tempo = 0;
			var avatar 		= 'img/icon_perfil.png';
			
			phonon.preloader( '#carregando' ).show();
				
			if( ( post_id != undefined ) && ( post_id != '' ) ){
				
				
				// removendo itens com animação
				$.each( $( '.entrega-mensagens .entrada' ), function( index, elemento ){
					
					tempo = parseInt( tempo ) + parseInt( 100 );
					//console.log( tempo );
					
					$( elemento ).delay( tempo ).slideUp();
				});
				
				
				
				$.ajax({
					url: config.api() +"/v1/mensagens/list/mensagens/"+ post_id, 
					method: 'GET', 
					timeout: 60000,
					data: {
						app: "cnm"
					}
				}).done(function(retorno){
					
					//console.log( post_id +" mensagens encontradas "+ retorno.length );
					//console.log( retorno );
					
					
					$.each( retorno, function( chave, valor ){
						
						//console.log( valor );
						
                        if( valor.avatar != '' ){
                            avatar = valor.avatar;
                        }
                        
						
						div += '<div class="entrada" style="margin-bottom:0px;">';
						div += '<div class="row entrada_header">';
						div += '<div class="phone-6 column">';
						div += '<div class="usuario">';
						div += '<img src="'+ avatar +'" class="pull-left borda" />';
						div += '<h4>'+ valor.nome +'</h4>';
						
						if( ( valor.cargo == undefined ) || (valor.cargo == '' ) ){
							valor.cargo = 'Morador';
						}
						
						div += '<p>'+ valor.cargo +'</p>';
						div += '</div>';
						div += '</div>';
						div += '<div class="phone-6 column text-right">';
						div += '<div class="data">'+ valor.data +'</div>';
						div += '</div>';
						div += '</div>';
						
						if( valor.titulo != undefined ){
							div += '<h3>'+ valor.titulo +'</h3>';
						}
						
						div += '<p>'+ valor.mensagem +'</p>';
						
						div += '</div>';
						
                        
                        // resete
                        avatar = 'img/icon_perfil.png';
					});
					
					$( '#mensagens-'+ post_id ).html( div );
					//console.log( "escrever em #mensagens-"+ post_id );
					
					phonon.preloader( '#carregando' ).hide();
					
					div = '';
					//post_id = '';
					retorno = null;
					
					
				}).fail(function( jxhr, status, statusText ){
					
					if( status === "timeout" ){
						phonon.alert( 'O servidor não está respondendo neste momento, tente novamente mais tarde.', "Problemas com a internet", true );
					}
					
					
					if( jxhr.status == 404 || statusText == 'Not Found' ){ 
						//console.log( JSON.parse( jxhr.responseText ).message );
					}
					
					phonon.preloader( '#carregando' ).hide();
				});
				
			}
			
			
			div = '';
		},
		
		
		responder: function( elemento ){
			
			var div = '';
			post_id = $( elemento ).attr( 'id' ).replace( 'responder-', '' );
			var avatar 		= 'img/icon_perfil.png';
			
			phonon.preloader( '#carregando' ).show();
			
			$.ajax({
				url: config.api() +"/v1/mensagens/add/mensagem/"+ post_id, 
				method: 'GET', 
				timeout: 60000,
				data: {
					app: 		"cnm", 
					email: 		$( '.email' ).val(),
					mensagem: 	$( '.responder-elogio'+ post_id ).val(), 
					user_id: 	$( '.user_id' ).val(),
					nome: 		$( '.nome' ).val(),
					login: 		$( '.login' ).val(),
				}
			}).done(function(retorno){
				
				//console.log( retorno );
				chave = retorno;
				if( retorno != null ){
				}
                
                usuario = user.dados();
                if( usuario.avatar != '' ){
                    avatar = usuario.avatar;
                }
                
                
				
				
				animar();
				
				$( '.responder'+ post_id ).val('');

				div += '<div class="entrada" style="margin-bottom:0px;">';
				div += '<div class="row entrada_header">';
				div += '<div class="phone-6 column">';
				div += '<div class="usuario">';
				div += '<img src="'+ avatar +'" class="pull-left borda" />';
				div += '<h4>'+ chave.nome +'</h4>';
				
				if( chave.cargo == undefined ){
					chave.cargo = 'Morador';
				}
				
				div += '<p>'+ chave.cargo +'</p>';
				div += '</div>';
				div += '</div>';
				div += '<div class="phone-6 column text-right">';
				div += '<div class="data">'+ chave.data +'</div>';
				div += '</div>';
				div += '</div>';
				
				if( chave.titulo != undefined ){
					div += '<h3>'+ chave.titulo +'</h3>';
				}
				
				div += '<p>'+ chave.mensagem +'</p>';
				
				div += '</div>';
				
				elemento = $( '#mensagens-'+ post_id +' .entrada:last' );
				
				// quando é a primeira mensagem não existe div.entrada
				if( elemento.size() > 0 ){
					elemento.after( div );
				}else{
					$( '#mensagens-'+ post_id ).html( div );
				}
				
				phonon.preloader( '#carregando' ).hide();
				
				
			}).fail(function( jxhr, status, statusText ){
				
				if( status === "timeout" ){
					phonon.alert( 'O servidor não está respondendo neste momento, tente novamente mais tarde.', "Problemas com a internet", true );
				}
				
				
				if( jxhr.status == 404 || statusText == 'Not Found' ){ 
					//phonon.alert( JSON.parse( jxhr.responseText ).message, "Opss, temos um problema", true );
					
					$( '.entrega-mensagens' ).html( "<h4 class='padded-top'>"+ JSON.parse( jxhr.responseText ).message +"</h4>" );
					//$( '.content' ).addClass( 'padded-full' );
				}
				
				phonon.preloader( '#carregando' ).hide();
			});
			
			
			div = '';
		},
		
		
		listar: function(){
			
			var div = '';
			var usuario = user.dados();
			var avatar 		= 'img/icon_perfil.png';
			
			//console.log( usuario.id );
			
			phonon.preloader( '#carregando' ).show();
			
			$.ajax({
				url: config.api() +"/v1/mensagens/list/", 
				method: 'GET', 
				timeout: 10000,
				data: {
					app: "cnm"
				}
			}).done(function(retorno){
				
				//console.log( retorno );
				
				if( retorno != null ){
					
					$.each( retorno, function( index, chave ){
						
						//console.log( chave );
						// coleta os dados do usuario do app
						usuario = user.dados();
						
						
                        if( chave.avatar != '' ){
                            avatar = chave.avatar;
                        }
                        
						
						div += '<a href="#!mensagens/detalhes/'+ chave.id +'" class="mensagens-detalhes" data-entrega="'+ chave.id +'">';
						div += '<div class="entrada" style="margin-bottom:0px;">';
						div += '<div class="row entrada_header">';
						div += '<div class="phone-6 column">';
						div += '<div class="usuario">';
						div += '<img src="'+ avatar +'" class="pull-left borda" />';
						div += '<h4>'+ chave.usuario +'</h4>';
						
						if( chave.cargo == undefined ){
							chave.cargo = 'Morador';
						}
						
						div += '<p>'+ chave.cargo +'</p>';
						div += '</div>';
						div += '</div>';
						div += '<div class="phone-6 column text-right">';
						div += '<div class="data">'+ chave.data +'</div>';
						div += '</div>';
						div += '</div>';
						
						if( chave.titulo != undefined ){
							div += '<h3>'+ chave.titulo +'</h3>';
						}
						
						div += '<p>'+ chave.mensagem +'</p>';
						
						div += '</div>';
						div += '<div class="entrega-mensagens" id="mensagens-'+ chave.id +'"></div>';
						
						div += '</div>';
						div += '</a>';
						
						/*
						 * COMENTEI PARA EVITAR EXIBIR O ITEM RESPONDER
						 * AO INVÉS DISSO IREMOS MOSTRAR A MENSAGEM E 
						 * LINK PARA VER Tudo
						 **/
                        if( usuario.avatar != '' ){
                            avatar = usuario.avatar;
                        }
                        
						
						div += '<div class="entrega-mensagens" id="mensagens-'+ chave.id +'"></div>';
						
						div += '<div class="entrada row entrada_header" style="padding:10px 20px 10px 30px;">';
						
						div += '<div class="phone-2 column">';
						div += '<div class="usuario">';
						div += '<img src="'+ avatar +'" class="pull-left borda" />';
						div += '</div>';
						div += '</div>';
						
						div += '<div class="phone-8 column">';
						div += '<textarea class="responder-elogio'+ chave.id +'" placeholder="Responder"></textarea>';
						div += '<input type="hidden" class="post_id" 	value="'+ chave.id +'" />';
						div += '<input type="hidden" class="nome" 		value="'+ usuario.nome +'" />';
						div += '<input type="hidden" class="email" 		value="'+ usuario.email +'" />';
						div += '<input type="hidden" class="user_id" 	value="'+ usuario.id +'" />';
						div += '</div>';
						
						div += '<div class="phone-2 column text-right">';
						div += '<div class="data"><a href="#" class="btn icon icon-seta-direita mensagens-resposta" id="responder-'+ chave.id +'"></a></div>';
						div += '</div>';
						div += '</div>';
						
						
						
						
						div += '<div class="padded-full"> </div>';
						div += '<div class="padded-full"> </div>';
						
                        
                        // resete
                        avatar = 'img/icon_perfil.png';
						phonon.preloader( '#carregando' ).hide();
					});
				}
				
				$( '#mensagens' ).html( div );
				
				
				animar();
				
				phonon.preloader( '#carregando' ).hide();
				
				
				//mensagens.listar_mensagens();
				
			}).fail(function( jxhr, status, statusText ){
				
				if( status === "timeout" ){
					phonon.alert( 'O servidor não está respondendo neste momento, tente novamente mais tarde.', "Problemas com a internet", true );
				}
				
				
				if( jxhr.status == 404 || statusText == 'Not Found' ){ 
					//phonon.alert( JSON.parse( jxhr.responseText ).message, "Opss, temos um problema", true );
					
					$( '#mensagens' ).html( '<div class="entrada text-center"><h4 class="padded-top">'+ JSON.parse( jxhr.responseText ).message +'</h4></div>' );
					//$( '.content' ).addClass( 'padded-full' );
				}
				
				
				//console.log( jxhr );
				//console.log( statusText );
				//console.log( status );
				//console.log( JSON.parse( jxhr.responseText ).message );
				
				
				phonon.preloader( '#carregando' ).hide();
			});
			
			
			div = '';
		},
		
		
		
		// sem uso atualmente
		detalhes: function(){
			
			var div = '';
			var usuario = user.dados();
			var avatar 		= 'img/icon_perfil.png';
			
			//console.log( usuario );
			
			phonon.preloader( '#carregando' ).show();
			
			$.ajax({
				url: config.api() +"/v1/mensagens/list/detalhes/"+ usuario.id, 
				method: 'GET', 
				timeout: 60000,
				data: {
					app: "cnm"
				}
			}).done(function(retorno){
				
				//console.log( retorno );
				chave = retorno;
				if( retorno != null ){
					
					//$.each( retorno, function( index, chave ){
						
						// coleta os dados do usuario do app
						usuario = user.dados();
						
                        if( chave.avatar != '' ){
                            avatar = chave.avatar;
                        }
                        
                        if( usuario.avatar != '' ){
                            avatar = usuario.avatar;
                        }
                        
						
						
						
						div += '<div class="entrada" style="margin-bottom:0px;">';
						div += '<div class="row entrada_header">';
						div += '<div class="phone-6 column">';
						div += '<div class="usuario">';
						div += '<img src="'+ avatar +'" class="pull-left borda" />';
						div += '<h4>'+ chave.usuario +'</h4>';
						
						if( chave.cargo == undefined ){
							chave.cargo = 'Morador';
						}
						
						div += '<p>'+ chave.cargo +'</p>';
						div += '</div>';
						div += '</div>';
						div += '<div class="phone-6 column text-right">';
						div += '<div class="data">'+ chave.data +'</div>';
						div += '</div>';
						div += '</div>';
						
						if( chave.titulo != undefined ){
							div += '<h3>'+ chave.titulo +'</h3>';
						}
						
						div += '<p>'+ chave.mensagem +'</p>';
						
						div += '</div>';
						div += '<div class="entrega-mensagens"></div>';
						
						div += '<div class="entrada row entrada_header" style="padding:10px 20px 10px 30px;">';
						
						div += '<div class="phone-2 column">';
						div += '<div class="usuario">';
						div += '<img src="'+ avatar +'" class="pull-left borda" />';
						div += '</div>';
						div += '</div>';
						
						div += '<div class="phone-8 column">';
						div += '<textarea class="responder" placeholder="Responder"></textarea>';
						div += '<input type="hidden" class="post_id" 	value="'+ chave.id +'" />';
						div += '<input type="hidden" class="nome" 		value="'+ usuario.nome +'" />';
						div += '<input type="hidden" class="email" 		value="'+ usuario.email +'" />';
						div += '<input type="hidden" class="user_id" 	value="'+ usuario.id +'" />';
						div += '</div>';
						
						div += '<div class="phone-2 column text-right">';
						div += '<div class="data"><a href="#" class="btn icon icon-seta-direita mensagens-resposta"></a></div>';
						div += '</div>';
						div += '</div>';
					//});
                        
                        // resete
                        avatar = 'img/icon_perfil.png';
				}
				
				$( '#mensagens' ).html( div );
				
				mensagens.listar_mensagens();
				
				animar();
				
				phonon.preloader( '#carregando' ).hide();
				
			}).fail(function( jxhr, status, statusText ){
				
				if( status === "timeout" ){
					phonon.alert( 'O servidor não está respondendo neste momento, tente novamente mais tarde.', "Problemas com a internet", true );
				}
				
				
				if( jxhr.status == 404 || statusText == 'Not Found' ){ 
					//phonon.alert( JSON.parse( jxhr.responseText ).message, "Opss, temos um problema", true );
					
					$( '#mensagens' ).html( "<h4 class='padded-top'>"+ JSON.parse( jxhr.responseText ).message +"</h4>" );
					//$( '.content' ).addClass( 'padded-full' );
				}
				
				
				//console.log( jxhr );
				//console.log( statusText );
				//console.log( status );
				//console.log( JSON.parse( jxhr.responseText ).message );
				
				
				phonon.preloader( '#carregando' ).hide();
			});
			
			
			div = '';
		},
		
		
		
		
	}
});