/**
 *  
 * Facilidade para compartilhar itens nas redes sociais
 * 
 * É necessário instalar o plugin
 * cordova-plugin-x-socialsharing
 **/
$(function(){
	
	
	compartilhar = {
		
		
		init: function(){
			
			$( document ).on( 'click', '.btn-compartilhar', function(){
				phonon.notif( "Ativando compartilhamento", 1000 );
				
				compartilhar.share();
			});
		},
		
		
		share: function(){
			window.plugins.socialsharing.share( 'Baixe agora seu '+ config.app_name, null, null, config.app_id() );
		}
		
	}
});