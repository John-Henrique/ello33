$(function(){
	
	mensagem = {
		
		user_id: localStorage.getItem( 'user_id' ),
		
		init: function(){
			
			$( '.icon-enviar' ).hide();
			
			$( '#mensagem' ).on( 'focus', function(){
				//enviar();
				
				$( '.icon-enviar' ).show();
				
				$( '.upload' ).hide();
				
			}).on( 'blur', function(){
				//enviar();
				
				$( '.icon-enviar' ).hide();
				$( '.upload' ).show();
				
			});
			
			$( '#mensagem' ).on( 'keydown', function( event ){
				
				if( event.which == 13 ){
					mensagem.enviar();
				}else{
					
					//phonon.notif( event, 10000, false );
				}
			});
			
			
			$( document ).on( 'click', '.icon-enviar', function(){
				mensagem.enviar();
			});
			
		}, 
		
		
		
		atualiza_listar: function(){
			
			mensagem.listar();
			setInterval(function(){
				mensagem.atualiza_listar;
				console.log( "carregando listar");
			},15000);
		},
		
		
		atualiza_conversas: function(){
			
			mensagem.conversas();
			setInterval(function(){
				mensagem.atualiza_conversas;
				console.log( "carregando");
			},15000);
		},
		
		/**
		 * Lista todas as conversas e grupos
		 */
		conversas: function(){
			
			telefone = localStorage.getItem( 'telefone' );
			
			
			funcoes.preloader( true );
			
			
			$.ajax({
				url: config.api() +"/v2/conversas/", 
				type: "POST",
				data: {
					telefone: telefone
				}
			}).done(function( resposta ){
				
				html = "";
				$.each( resposta, function( index, valor ){
					
					status = '';
					
					mensagem = valor.mensagem;
					if( mensagem.indexOf( 'img' ) != -1 ){
						mensagem = "<i class='icon-camera'></i> foto";
					}
					
					
					if( valor.msg_total != 0 ){
						status = '-nao';
					}
					
					
					if( valor.avatar == '' ){
						valor.avatar = 'img/icones/avatar-b.png';
					}
					
					contato = 'treta';
					// se for um grupo
					if( valor.grupo == 1 ){
						contato = valor.grupo_nome;
					}else{
						
						
						if( valor.telefones[0] != telefone ){
							//console.log( "Telefone contato 0 "+ valor.telefones[0] );
							contato = valor.telefones[0];
						}else if( valor.telefones[1] != telefone ){
							//console.log( "Telefone contato 1 "+ valor.telefones[1] );
							contato = valor.telefones[1];
						}else{
							contato = "Desconhecido";
						}
					}
					
					
					html += '<li class="item-expanded">';
					html += '<a href="#" class="pull-right">';
					html += '	<!--<i class="pull-left icon icon-sound-off"></i>-->';
					html += '	<span class="hora">'+ valor.data +'</span>';
					html += '	<span class="msg'+ status +'-lido">'+ valor.msg_total +'</span>';
					html += '</a>';
					html += '<a href="#" class="pull-left padded-left perfil">';
					html += '	<img src="'+ valor.avatar +'" class="perfil circle" />';
					html += '</a>';
					html += '<div class="item-content">';
					html += '	<a href="#!privado/'+ valor.id +'/'+ contato +'/'+ contato +'">';
					html += '		<span class="title">'+ contato +'</span>';
					html += '		<span class="body">'+ mensagem +'</span>';
					html += '		<a name="mensagem-'+ valor.id +'"></a>';
					html += '	</a>';
					html += '</div>';
					html += '</li>';
				});
				
				$( '.conversas ul' ).html( html );
				$( ".conversas .listas ul" ).animate({scrollTop: $('.conversa').prop("scrollHeight")}, 3000);
				
				
				// conta todas as mensagens deste usuário
				funcoes.totalMsg();
				
				// fechando o preloader
				funcoes.preloader( false );
				
				// só depois de pronto
				/*
				document.addEventListener( 'deviceready', function(){
					//phonon.notif( "Notificaçao", 2000, false);
					//agendar5segundos( mensagem );
				}, false);
				 * */
				
			}).fail(function( x, t, m ){
				
				// sempre que a conexão estiver lenta
				if( t==="timeout" ){
					phonon.alert( 'O servidor não está respondendo neste momento, tente novamente mais tarde.', "Problemas com a internet", false );
				}
					
					if( x.status == 404 || m == 'Not Found' ){ 
						phonon.notif( JSON.parse( x.responseText ).message, 5000, false );
					}
					
					
					if( x.status == 500 ){ 
						phonon.notif( JSON.parse( x ).message, 5000, false );
					}
				
				// fechando o preloader
				funcoes.preloader( false );
				
			});
		},
		
		
		
		/**
		 * Lista as mensagens da janela de conversa
		 */
		listar: function(){
			
			telefone = localStorage.getItem( 'telefone' );
			
			//funcoes.preloader( true );
			
			/**
			 * identifica as mensagens em exibição 
			 * antes da consulta porque assim 
			 * evitamos o carregamento duplicado
			 **/
			funcoes.excluir_comentarios();
			
			post_id = $( '.post_ID' ).val();
			if( post_id != 'novo' ){
				
				$.ajax({
					url: config.api() +"/v1/privado/"+ post_id, 
					type: "GET", 
					data: {
						search: $( '.search' ).val(), 
						excluir_comentarios: $( '.excluir_comentarios' ).val()
					}
				}).done(function( resposta ){
					
					//console.log( resposta );
					html = "";
					$.each( resposta.reverse() , function( index, valor ){
						
						
						if( valor.tel_autor == undefined ){
							valor.tel_autor = '';
						}
						
						// quando for uma mensagem minha, posicionar a direita 
						if( ( valor.telefone_autor == telefone ) || ( valor.tel_autor == telefone ) ){
							define_lado = 'right';
							define_lado2 = 'left';
						}else if( valor.telefone_autor == '' ){
							
							define_lado = define_lado2 = 'center';
						}else{
							
							// escreve o numero do telefone do contato
							// isto escreve o numero errado
							//$( '.info span' ).text( valor.telefone_autor );
							
							define_lado = 'left';
							define_lado2 = 'right';
						}
						
						
						html += '<div class="padded-full text-'+ define_lado +' mensagem" id="'+ valor.id +'">';
						html += '	<p class="padded-'+ define_lado2 +'">';
						html += '		<span class="texto">'+ valor.mensagem +'</span> ';
						html += '		<span class="hora">'+ valor.data +' '+ valor.telefone_autor + valor.tel_autor +'</span>';
						html += '		<a name="mensagem-'+ valor.id +'"></a>';
						html += '	</p>';
						html += '</div>';
						
					});
					
					
					if( resposta.length != 0 ){
						//html += '<div class="padded-full">&nbsp;</div>';
						//html += '<div class="padded-full">&nbsp;</div>';
					}
					
					$( '#mensagens' ).append( html );
					//$( "#mensagens" ).html( html );
					$(".conversa").animate({scrollTop: $( ".conversa" ).prop("scrollHeight")}, 100);
					
					
					// fechando o preloader
					//funcoes.preloader( false );
					
					
				}).fail(function( x, t, m ){
					
					// sempre que a conexão estiver lenta
					if( t==="timeout" ){
						phonon.alert( 'O servidor não está respondendo neste momento, tente novamente mais tarde.', "Problemas com a internet", false );
					}
						
						if( x.status == 404 || m == 'Not Found' ){ 
							phonon.notif( JSON.parse( x.responseText ).message, 5000, false );
						}
					
					
					// fechando o preloader
					funcoes.preloader( false );
				});
			}
		},
		
		
		
		enviar: function(){
			
			elemento = $( "#mensagem" );
			texto = elemento.val();
			elemento.val('');
			
			telefone = localStorage.getItem( 'telefone' );
			
			
			// fechando o preloader
			funcoes.preloader( true );
			
			
			if( texto != '' ){
				
				$.ajax({
					url: config.api() +"/v1/enviar", 
					type: "POST",
					data: {
						mensagem: texto,
						nome: $( '.nome' ).val(),
						email: $( '.email' ).val(),
						user_id: $( '.user_id' ).val(),
						telefone: $( '.telefone' ).val(),
						post_id: $( '.post_ID' ).val(), 
						telefone_autor: telefone, 
						excluir_comentarios: $( '.excluir_comentarios' ).val()
					}
				}).done(function( resposta ){
					
					listar();
					
					//phonon.notif( "Mensagem enviada", 1000, false);
					console.log( resposta );
					
					if( post_id == 'novo' ){
						//$( '.post_ID' ).val();
					}
					// fechando o preloader
					funcoes.preloader( false );
					
				}).fail(function( x, t, m ){
					
					// sempre que a conexão estiver lenta
					if( t==="timeout" ){
						phonon.alert( 'O servidor não está respondendo neste momento, tente novamente mais tarde.', "Problemas com a internet", false );
					}
					
					if( x.status == 404 || m == 'Not Found' ){ 
						phonon.notif( JSON.parse( x.responseText ).message, 5000, false );
					}
					
				
					// fechando o preloader
					//funcoes.preloader( false );
					
				});
			}
		},
		
		apagar: function(){
			
		}
	}
});