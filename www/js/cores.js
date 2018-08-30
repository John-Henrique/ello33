$(function(){
	
	cores = {
		
		init:function(){
			
			$( document ).on( 'click', 'cores .cores img', function(){
				phonon.notif( "Alterando cores do tema", 1000, true, "Fechar" );
				cores.seleciona_tema( this );
			});
			
			
			
			
			
		},
		
		
		/**
		 * Salvando a opção de tema escolhido
		 * */
		seleciona_tema: function( evento ){
			
			tema = $( evento ).prop( 'id' );
			
			console.log( tema );
			
			localStorage.setItem( 'tema', tema );
			
			$( document ).find( '#css' ).prop( 'href', 'css/'+ tema +'.css' );
		}
	}
});