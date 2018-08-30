$(function(){
		
	mensagem = {
		
		init: function(){
				
			
			$( '#mensagem' ).on( 'keydown', function( event ){
				
				if( event.which == 13 ){
					mensagem.enviar();
				}else{
					
					//phonon.notif( event, 10000, false );
					console.log( 'não digitou 13' );
				}
			});
			
			
			$( document ).on( 'click', '.icon-enviar', function(){
				console.log( "icon-enviar");
				mensagem.enviar();
			});
		},
		
		
		
		/**
		 * Envia a mensagem para o contato 
		 * Salva a mensagem na base de dados local
		 * */
		enviar: function(){
			
			console.log( "Mensagen enviada" );
			
			return insertData( 'mensagens', {
				id: null, 
				contatos_id: funcoes.pega_user_id(),
				grupos_id: null,
				destino_id: funcoes.pega_contato_id(), 
				tipo: 0,
				texto: $( '#mensagem' ).val(), 
				situacao: 0, 
				enviada: moment().format( 'YYYY-MM-DD HH:mm:ss' ),
				recebida: null,
				lida: null,
				favorito: 0, 
				situacao_pedido: 0
			}, function(resultado){
				//console.log( resultado );
				
				/**
				 * Envia a notificação para o destinatário 
				 * ele só receberá a mensagem caso receba 
				 * a notificação
				 * */
				firebase.sendPush();
				
				
				// limpa o campo #mensagem
				$( '#mensagem' ).val('');
				
				
				
				
				/**
				 * adicionou a mensagem, temos que atualizar 
				 * as mensagens existentes
				 * */
				mensagem.pega_mensagens_nao_lidas();
			});
		},
		
		
		/**
		 * Lista todas as mensagens 
		 * de todos os contatos na 
		 * principal
		 * */
		listar: function(){
			
			// getData( strTable, rWhere, order, callback )
			getData( 'mensagens', {
				contatos_id: funcoes.pega_user_id(), 
				
			}, 'enviada ASC', function( resposta ){
				
				console.log( resposta );
				mensagem.html_mensagens( resposta );
				
				/*
				for( i=0; i < resposta.length; i++ ){
					console.log( resposta.item( i ) );
					console.log( resposta.item( i ).id );
					console.log( resposta.item( i ).texto );
				}
				 * */
			});
		},
		
		
		listar_privado: function(){
			var resposta;
			
			console.log( "autor "+ funcoes.pega_user_id() );
			console.log( "destino "+ funcoes.pega_contato_id() );
			
			/*
			getData( 'mensagens', {
				contatos_id: funcoes.pega_user_id(), 
				destino_id: funcoes.pega_contato_id()
			}, 'enviada ASC', function( resposta ){
				
				mensagem.html_mensagens( resposta );
			});
			*/
			getMsgPrivado( funcoes.pega_user_id() +','+ funcoes.pega_contato_id(), function( res ){
				
				mensagem.html_mensagens( res );
			});
		},
		
		
		/**
		 * Receber as minhas mensagens ainda não lidas
		 * elas terão o campo "lida" marcados com null
		 * */
		pega_mensagens_nao_lidas: function(){
			
			getData( 'mensagens', {
					destino_id: funcoes.pega_user_id,
					lida: null, 
				}, 'enviada ASC', function( res ){
				
					r = res.rows;
					for( i=0; r.length; i++ ){
						
						updateData( 'mensagens', {
								lida: moment().format( 'YYYY-MM-DD HH:mm:ss' )
							}, {
								id: r.item( i ).id, 
								contatos_id: funcoes.pega_user_id()
						}, function( res ){
							console.log( "updateData "+ r.item( i ).id );
							console.log( res );
						});
					}
			});
		},
		
		
		apagar: function( mensagem_id ){
			
			deteleData( 'mensagens', {
				id: mensagem_id, 
				contatos_id: funcoes.pega_user_id()
			}, function( resposta ){
				
				console.log( resposta );
			});
		},
		
		
		
		html_mensagens: function( resposta ){
			
			html = "";
			res = resposta.rows;
			
			
			for( i=0; i < res.length; i++ ){
				
				console.log( res.item( i ) );
				
				// recupera o telefone da storage
				telefone 	= funcoes.pega_telefone();
				autor_id 	= funcoes.pega_user_id();
				contato_id 	= funcoes.pega_contato_id();
				
				
				// quando for uma mensagem minha, posicionar a direita 
				if( res.item( i ).contatos_id == autor_id ){
					define_lado = 'right';
					define_lado2 = 'left';
				}else if( res.item( i ).destino_id == contato_id ){
					
					define_lado = define_lado2 = 'center';
				}else{
					
					/*
					 * quando for uma mensagem do meu contato 
					 * posicionar a esquerda
					 */
					// escreve o numero do telefone do contato
					define_lado = 'left';
					define_lado2 = 'right';
				}
				
				//console.log( "lida "+ res.item( i ).lida +' '+ typeof( res.item( i ).lida ) );
				
				html += ' <div class="padded-full text-'+ define_lado +' mensagem" id="'+ res.item( i ).id +'">';
				html += ' 	<p class="padded-'+ define_lado2 +'">';
				html += ' 		<span class="texto">'+ res.item( i ).texto +' destino_id '+ contato_id +' autor '+ res.item( i ).contatos_id +'</span>';
				html += ' 		<span class="hora">'+ moment( res.item( i ).enviada ).format( 'HH:mm' ) +'</span>';
				html += ' 		<a name="mensagem-'+ res.item( i ).id +'"></a>';
				html += ' 	</p>';
				html += ' </div>';
				
			};
			
			
			if( res.length != 0 ){
				//html += '<div class="padded-full">&nbsp;</div>';
				//html += '<div class="padded-full">&nbsp;</div>';
			}
			
			$( '#mensagens' ).append( html );
			//$( "#mensagens" ).html( html );
			$(".conversa").animate({scrollTop: $( ".conversa" ).prop("scrollHeight")}, 100);
			
		}
	}
});