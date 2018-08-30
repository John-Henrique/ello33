$(function(){
	
	contato = {
		
		
		init: function(){
			console.log( 'contatos.js');
			
			// aplicando mascara nos telefones
			$( '#telefone' ).mask('(00) 00000-0000');
			
			/**
			 * Lista todos os contatos do dispositivo 
			 * verifica se existem na base de dados web 
			 * se existirem, adiciona na tabela contatos
			 * */
			$( document ).on( 'click', '.contatos-atualizar', function(){
				//contato.atualizar();
				contato.listar(); // recarrega a lista de contatos
			});
			
			
			/**
			 * Adiciona o novo contato 
			 * */
			$( document ).on( 'click', '.btn-adicionar-contato', function(){
				
				contato.adicionar(); // adiciona o contato na base local
			});
			
			
			/**
			 * Exibe o campo pesquisar contatos
			 * 
			 * */
			$( document ).on( 'click', '.btn-search, .voltar-normal', function(){
				
				$( '.toggle' ).toggle();
				
				$( '#pesquisa-contato' ).val( '' );
				
				
				// lista novamente todos os contatos
				contato.listar();
			});
			
			
			/**
			 * quando pressionado, aguardar até 
			 * completar 3 digitos antes de iniciar 
			 * a pesquisa de contatos
			 * */
			$( '#pesquisa-contato' ).on( 'keydown', function(){
				
				valor = $( this ).val();
				if( valor.length >= 3 ){
					console.log( 'pressionado '+ valor );
					
					
					/**
					 * Lista os dados de acordo com 
					 * a consulta
					 * */
					getAll( 'contatos', 'WHERE nome LIKE ? ORDER BY nome ASC', {valor}, function( res ){
						contato.html_contatos( res );
					});
				}
			});
		},
		
		
		/**
		 * Recupera o telefone do 
		 * contato informado por 
		 * contato_id
		 * 
		 * @return Object contendo registros encontrados
		 * @since 2018-08-29
		 * */
		getContatoTelefone: function( contato_id ){
			
			getData( 'contatos', {
				id: contato_id
			}, 'id ASC', function( res ){
				console.log( res );
				
				contato_telefone = {};
				
				for( i=0; i < res.rows.length; i++ ){
					r = res.rows;
					
					contato_telefone[ i ] = r.item( i ).telefone;
				}
				
				localStorage.setItem( 'contato_telefone', contato_telefone );
			});
		},
		
		
		/**
		 * Retorna o total de contatos 
		 * encontrados na consulta
		 * */
		getTotalContatos: function(){
			
			return (localStorage.getItem( 'contatos_total' )||0);
		},
		
		
		/**
		 * Lista todos os contatos que utilizam o app 
		 * existentes na tabela 'contatos'
		 * */
		listar: function(){
			
			// lista todos 'sem condições'
			getData( 'contatos', null, null, function( res ){
				contato.html_contatos( res );
			});
			
			/*
			getAll( 'contatos', 'ORDER BY id ASC', {}, function( res ){
				console.log( res );
			});
			*/
		},
		
		
		/**
		 * @deprecated 2018-08-29
		 * 
		 * Lista todos os contatos do dispositivo 
		 * verifica se existem na base de dados web 
		 * se existirem, adiciona na tabela contatos
		 * */
		atualizar: function(){
			
		},
		
		
		
		
		adicionar: function(){
			
			/**
			 * Salvando os dados na tabela contatos
			 **/
			insertData( 'contatos', {
					'nome'		: $( '#nome' ).val(),
					'telefone'	: $( '#telefone' ).cleanVal(), 
					'criado'	: moment().format( 'YYYY-MM-DD DD:mm:ss' )
				}, function( id ){
					console.log( id );
					
					phonon.navigator().changePage( 'perfil', id );
			});
		},
		
		
		
		
		html_contatos: function( res ){
			
			html 	= '';
			img		= 'perfil homem 1 perfil.jpg';
			//console.log( res );
			
			
			html +=	'<li class="item-expanded .contatos-atualizar">';
			html +=	'	<a href="#" class="pull-left padded-left icon icon-sync"></a>';
			html +=	'	<div class="item-content">';
			html +=	'		<span class="title">Atualizar lista</span>';
			html +=	'		<span class="body">Clique e aguarde</span>';
			html +=	'	</div>';
			html +=	'</li>';
			
			
			// total de contatos existentes
			localStorage.setItem( 'contatos_total', res.rows.length );
			
			
			for( i=0; i < res.rows.length; i++ ){
				r = res.rows;
				
				html +=	'<li class="item-expanded">';
				html +=	'	<a href="#!privado/'+ r.item( i ).id +'/'+ r.item( i ).telefone +'" class="pull-right">cel</a>';
				html +=	'	<a href="#!privado/'+ r.item( i ).id +'/'+ r.item( i ).telefone +'" class="pull-left padded-left">';
				html +=	'		<img src="img/'+ img +'" class="circle" />';
				html +=	'	</a>';
				html +=	'	<a href="#!privado/'+ r.item( i ).id +'/'+ r.item( i ).telefone +'">';
				html +=	'		<div class="item-content">';
				html +=	'			<span class="title">'+ r.item( i ).nome +'</span>';
				html +=	'			<span class="body">'+ r.item( i ).telefone +'</span>';
				html +=	'		</div>';
				html +=	'	</a>';
				html +=	'</li>';
			}
			
			
			$( "principal .clientes ul" ).html( html );
			
			//return html;
		}
	}
});