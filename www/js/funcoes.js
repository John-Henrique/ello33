/** FUNÇÕES PARA AUXILIO */

// aguarda o carregamento da biblioteca JavaScript
$(function(){
	
	// iniciando a classe funcoes
	funcoes = {
		
		init: function(){
			
			console.log( 'funcoes.js');
			
			
			/**
			 * Quando a aba for alterada 
			 * */
			phonon.navigator().onPage('principal').addEvent('tabchanged', function (tabNumber) {
				
				$( '.floating-action' ).hide();
				
				
				if( tabNumber == 3 ){
					$( '.btn-clientes' ).show();
				}
				
				if( tabNumber == 2 ){
					$( '.btn-conversas' ).show();
				}
				
				if( tabNumber == 1 ){
					$( '.btn-reunioes' ).show();
				}
				
				console.log( 'botao '+ tabNumber );
			});
		},
		
		
		botao_enviar: function(){
			
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
		},
		
		
		/**
		 * Na tela de login, caso haja algum erro 
		 * com as requisições no servidor, o JavaScript 
		 * para de funcionar, então, detectamos o erro 
		 * por ficarmos congelados na página login
		 **/
		detectar_erro: function(){
			setTimeout(function(){
				
				if( phonon.navigator().currentPage == 'login ' ){
					notif( "O servidor está apresentando erros", 3000 );
					
					setTimeout(function(){
						notif( "Tente novamente mais tarde", 10000 );
					});
				}
			},5000);
		},
		
		
		parar_midia: function(){
			
			$.each( $( 'video, audio' ), function( index, valor ){
				valor.pause();
				$( valor ).attr( 'src', '' );
				
				//console.log( index );
			});
		},
		
		
		excluir_comentarios: function(){
			ids = '';
			$.each( $( '.mensagem' ), function( index, valor ){
				ids += valor.id +',';
			});
			
			$( '.excluir_comentarios' ).val( ids );
		},
		
		
		// atalho para usar phonon.preloader()
		preloader: function( action ){
			
			// acao a realizar
			if( action == true ){
				phonon.preloader( '.circle-progress' ).show();
			}else{
				phonon.preloader( '.circle-progress' ).hide();
			}
		},
		
		
		// atalho para usar phonon.notif()
		notif: function( str, timeout, botao ){
			
			// tempo padrão 
			if( timeout == undefined ){
				timeout = 3000;
			}
			
			// mostrar botão 
			if( botao == undefined ){
				botao = false;
			}else{
				botao = true;
			}
			
			phonon.notif( str, timeout, botao );
		},
		
		
		totalMsg: function(){
			
			$( '.msg-nao-lido-total' ).hide();
			
			//setInterval( function(){
			// contador para auxiliar no calculo
			total = 0;
				$( '.conversas .msg-nao-lido' ).each( function(index, chave){
					
					// somando valores
					total = parseInt( total ) + parseInt( $( this ).text() );
				});
				
				$( '.msg-nao-lido-total' ).text( total );
				
				if( total == 0 ){
					$( '.msg-nao-lido-total' ).hide();
				}else{
					$( '.msg-nao-lido-total' ).show();
				}
			//}, 1000);
		}, 
		
		
		vibra_nova_mensagem: function(){
			document.addEventListener( 'deviceready', function(){
				navigator.vibrate(1000,1000,1000);
			}, false);
		},
		
		
		/*
		 * Salva o avatar do contato para posterior uso
		 * no privado
		 */
		salva_avatar: function(){
			$( document ).on( 'click', '.conversas li, .contatos li', function(){
				foto = $( this ).find( 'img' ).attr( 'src' );
				localStorage.setItem( 'contato_avatar', foto.replace( '-b.png', '.png' ) );
			});
		},
		
		
		/*
		 * Recupera o avatar do contato selecionado
		 */
		pega_avatar: function(){
			return localStorage.getItem( 'contato_avatar' );
		},
		
		
		
		/*
		 * Salva o nome do contato para posterior uso
		 * no privado
		 */
		salva_nome: function(){
			$( document ).on( 'click', '.conversas li, .contatos li', function(){
				localStorage.setItem( 'contato_nome', $( this ).find( '.item-content .title' ).text() );
			});
		},
		
		
		/*
		 * Salva o ID do contato para posterior uso
		 * no privado
		 */
		salva_contato_id: function(){
			$( document ).on( 'click', '.conversas li, .contatos li', function(){
				localStorage.setItem( 'contato_id', $( this ).find( '.item-content .title' ).data( 'contato-id' ) );
			});
		},
		
		
		/*
		 * Recupera o nome do contato selecionado
		 */
		pega_nome: function(){
			return localStorage.getItem( 'contato_nome' );
		},
		
				
		
		/*
		 * Recupera o telefone do usuario local selecionado
		 */
		pega_telefone: function(){
			return localStorage.getItem( 'telefone' );
		},
		
		
		/*
		 * Recupera o telefone do contato (destino) selecionado
		 * 
		 * Pode ser um array contendo vários telefones (grupo)
		 */
		pega_telefone_contato: function(){
			return localStorage.getItem( 'telefone_contato' );
		},
		
		
		/**
		 * Recupera o ID do usuário 
		 * usuário = autor da mensagem
		 * */
		pega_user_id: function(){
			
			user_id = localStorage.getItem( 'user_id' );
			
			/**
			 * Evitando que seja retornado zero como 
			 * ID do usuário, 1 será o ID do usuário 
			 * no próprio dispositivo 
			 * */
			if( ( user_id == "" ) || ( user_id == undefined ) ){
				user_id = 1;
			}
			
			return user_id;
		},
		
		/**
		 * Atalho para recuperar ID do usuário 
		 * */
		user_id: function(){
			return funcoes.pega_user_id();
		},
		
		
		/*
		 * Recupera o ID do contato selecionado
		 */
		pega_contato_id: function(){
			return localStorage.getItem( 'contato_id' );
		},
		
		
		
		emoji: function(){
			
			$( 'img.lista-emoji' ).click(function(){
				$( '#mensagem' ).val( $( '#mensagem' ).val() +' ;-) ' );
				phonon.panel( '#emoji' ).close();
			});
		}
	}
	
	

// atalho para usar phonon.notif()
function notif( str, timeout ){
	
	// tempo padrão 
	if( timeout == undefined ){
		timeout = 3000;
	}
	
	phonon.notif( str, timeout, false );
}



});