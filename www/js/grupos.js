/**
 * 
 * @since 2018-07-17
 * */

$(function(){
	
	grupo = {
		
		init: function(){
			
			grupo.sair();
		}, 
		
		
		sair: function(){
			
			$( '.grupo-sair' ).on( 'click', function(){
				console.log( "Grupo "+ $( this ).data( 'grupo-id' ) );
				
				var confirm = phonon.confirm( "Deseja mesmo sair deste grupo?", "Sair do grupo", true, "Sair", "Quero ficar" );
				confirm.on('confirm', function(){
					phonon.notif( "Saindo do grupo... ", 3000, true );
					
					phonon.navigator().changePage( 'principal' );
				});
				confirm.on('cancel', function() {} );
			});
		}
	}
});