$(function(){
	
	
	login = {
		
		// telefone de login
		telefone: '',
		
		
		
		init: function(){
			
			$( document ).on( 'click', '.logar', function(){
				login.validar();
			});
			
			
			// aplicando mascara no telefone
			$('#chave_acesso').mask('(00) 00000-0000');
			
			
			this.verificar_login();
		},
		
		getTelefone: function(){
			
			return localStorage.getItem( 'telefone' );
		},
		
		
		setTelefone:function( telefone ){
			localStorage.setItem( 'telefone', telefone );
			
			/**
			 * agora já temos o telefone, podemos realizar 
			 * o registro da chave juntamente com o numero 
			 * de telefone deste usuário
			 * */
			firebase.init();
		},
		
		
		validar: function(){
			
			telefone = $( '#chave_acesso' ).cleanVal();
			
			if( telefone == '' ){
				notif = phonon.notif( 'Você precisa informar seu celular', 3000, true );
				notif.setColor( 'negative' );
				return;
			}
					
			if(telefone.length <= 10){
				notif = phonon.notif( 'Parece que estão faltando alguns numeros', 3000, true );
				notif.setColor( 'negative' );
				return;
			}
			
			if(telefone.length > 12){
				notif = phonon.notif( 'Parece que você adicionou numeros demais', 3000, true );
				notif.setColor( 'negative' );
				return;
			}
			
			if($.isNumeric( telefone ) == false){
				notif = phonon.notif( 'Você deve digitar apenas numeros', 3000, true );
				notif.setColor( 'negative' );
				return;
			}
			
			
			// se ficar congelado por 5 segundos
			//funcoes.detectar_erro();
			//localStorage.setItem( 'telefone', telefone );
			login.setTelefone( telefone );
			
			//location.replace = "#!principal";
			//phonon.notif( 'Logado '+ login.getTelefone(), 3000, true );
			phonon.navigator().changePage( "principal" );
			//window.location.href ="#!principal";
			
		},
		
		
		/**
		 * 
		 * tela: login
		 **/
		verificar_login: function(){
			
			telefone = login.getTelefone();
			if( ( telefone != undefined ) && ( telefone != null ) && ( telefone != '' ) ){
				//console.log( telefone );
				// usuario nao logado
				phonon.navigator().changePage( 'principal' );
			}
		},
		
		
		/**
		 * verifica se o usuario esta logado 
		 * se não estiver vai para a tela login
		 * tela: principal
		 **/
		esta_logado: function(){
			
			telefone = login.getTelefone();
			if( ( telefone == undefined ) || ( telefone == null ) || ( telefone == '' ) ){
				
				//console.log( telefone );
				phonon.navigator().changePage( 'login' );
			}
		}
	}
});