/**
 * Controla as notificações usando Firebase
 * https://github.com/arnesson/cordova-plugin-firebase
 * CORDOVA-PLUGIN-Firebase
 * 
 * Dependencias 
 * phonegap-plugin-whitelist
 * phonegap-plugin-network-information
 * 
 * @since 2017-02-20
 **/
$( function(){
	
	
	document.addEventListener( "deviceready", notificacoes, false );
	
	
	function notificacoes(){
		
		/**
		 * Vamos iniciar o firebase apenas depois de 
		 * fazer login do dispositivo, assim, teremos 
		 * o telefone para registrar
		 * 
		 * 
		 * login.setTelefone()
		 * */
		
		setTimeout(function(){
			//firebase.init();
		},4000);
	}
	
	
	firebase = {
		
		init: function(){
			
			this.getToken();
			
			
			this.onTokenRefresh();
			
			
			this.onNotificationOpen();
			
			
			
			// responsavel por enviar push
			this.sendPush();
		},
		
		
		getToken: function(){
			
			//phonon.preloader( ".circle-progress" ).show();
			
			window.FirebasePlugin.getToken(function(token) {
				// save this server-side and use it to push notifications to this device
				//console.log( token );
				
				$.ajax({
					url: config.api() +'/v1/dispositivos/add',
					type: "POST", 
					data: {
						token: token, 
						exists: localStorage.getItem( 'push' ), 
						telefone: localStorage.getItem( 'telefone' ), 
						app: config.app_name
					},
					timeout: 10000
				}).done( function(response) {
						
					//phonon.preloader( ".circle-progress" ).hide();
					console.log(response);
					console.log( response.message );
					localStorage.setItem( 'push', response );
				}).fail( function( response ){
					console.log( JSON.parse( response ).message );
				});
			
			}, function(error){
				phonon.notif( "TESTE "+ error, 5000, false );
			});
			
		},
		
		
		onTokenRefresh: function(){
			
			window.FirebasePlugin.onTokenRefresh(function(token) {
				// save this server-side and use it to push notifications to this device
				//phonon.notif( token, 5000, false );

				$.ajax({
					url: config.api() +'/v1/dispositivos/add',
					type: "POST", 
					data: {
						token: token, 
						exists: localStorage.getItem( 'push' ), 
						telefone: localStorage.getItem( 'telefone' ), 
						app: config.app_name
					},
					timeout: 10000
				}).done( function(response) {
						
					//phonon.preloader( ".circle-progress" ).hide();
					//phonon.notif( "Dispositivo adicionado "+ JSON.stringify( response ), 4000, false );
					localStorage.setItem( 'push', response );
				});
			}, function(error) {
				phonon.notif( error, 5000, false );
			});
		},
		
		
		onNotificationOpen: function(){
			
			window.FirebasePlugin.onNotificationOpen(function(notification) {
				//phonon.notif( "Acoes "+ JSON.stringify( notification ), 5000, false );
				console.log( notification );
				
				dados = notification;
				
				/**
				 * Quando o usuário toca na notificação 
				 * notification.tap se torna true 
				 * 
				 * Quando a notificação possuir contatos_id, destino_id 
				 * e o usuário não tiver clicado na notificação...
				 * vamos adicionar a mensagem na base de dados e 
				 * atualizar a lista de mensagens da tela principal
				 * */
				if( ( dados.contatos_id != null ) &&  ( dados.destino_id != null ) && ( dados.tap == false ) ){
					
					insertData( 'mensagens', {
						id: null, 
						contatos_id: dados.contatos_id,
						grupos_id: null,
						destino_id: dados.destino_id, 
						tipo: 0,
						texto: dados.body, 
						situacao: 0, 
						recebida: moment().format( 'YYYY-MM-DD HH:mm:ss' ),
						favorito: 0, 
						situacao_pedido: 0
					}, function(resultado){
						console.log( resultado );
					});
					
				}else{
					
					/**
					 * Quando o usuário clicar na notificação 
					 * vamos leva-lo para a tela privada da 
					 * conversa ou grupo
					 **/
					if( ( dados.grupos_id != null ) && ( dados.grupos_id != 0 ) ){
						console.log( 'grupos_id '+ dados.grupos_id +' '+ typeof( dados.grupos_id ) );
						phonon.navigator().changePage( 'grupo', dados.destino_id );
					}else{
						console.log( 'destino_id '+ dados.destino_id +' '+ typeof( dados.destino_id ) );
						phonon.navigator().changePage( 'privado', dados.destino_id );
					}
				}
				
			}, function(error) {
				phonon.notif( error, 5000, false );
			});
		},
		
		
		/**
		 * Envia o push ao servidor
		 * 
		 * Simplificando tudo
		 * Vou enviar apenas:
		 *  - telefone do destino
		 *  - telefone de origem
		 *  - mensagem
		 *  - carga de dados
		 * 
		 * No servidor push.php irá consultar 
		 * a base de dados (dispositivos) procurando pelo 
		 * telefone informado em 'destino', o telefone 
		 * permite encontrar a chave key do dispositivo 
		 * 
		 * push.php encaminha a carga de dados, a mensagem 
		 * e o telefone de origem para a chave key encontrada 
		 * 
		 * O dispositivo destino, identifica as informações da 
		 * carga de dados e salva as informações localmente
		 * 
		 * Alterar ajax para consulta.send()
		 * 
		 * caso a mensagem não seja enviada 
		 * verificar em mensagem.enviar() 
		 * existe uma instrução para limpar 
		 * o campo
		 * */
		sendPush: function(){
			
			consulta.send( "/v1/dispositivos/enviar", {
				mensagem:		 	$( '#mensagem' ).val(), 
				titulo:			 	'Ello33', 
				telefone_destino:	funcoes.pega_telefone_contato(), 
				telefone_origem:	funcoes.pega_telefone(), 
				
				dados:		{
						mensagem:$( '#mensagem' ).val(), 
						telefone_origem:funcoes.pega_telefone(), 
						telefone_destino:funcoes.pega_telefone_contato() // pode ser um array contendo vários telefones
					}
					 
			}, function( res ){
				console.log( res );
			}, function( erro ){
				console.log( erro );
			});
		}
	}
	
});