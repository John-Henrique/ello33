$(function(){
	
	config = {
		
		// Nome do app
		app_name: 'Ello33',
		
		
		// URL para o servidor
		servidor: 'http://ello33.com',
		
		
		// base de dados
		db: function(){
			db_name = "ello33";
			
			console.log( "database definida "+ db_name );
			
			return db_name;
		},
		
		
		// URL para acesso a API
		api: function(){
			return this.servidor +'/wp-json/api';
		},
		
		// URL para a pasta de imagens
		img: function(){
			return this.servidor +'/wp-content/uploads';
		},
		
		
		// ID do app na Google Play Store
		app_id: function(){
			
			if( phonon.device.os == 'Android' ){
				return "https://play.google.com/store/apps/details?id=br.com.johnhenrique.ello33";
			}else if( phonon.device.os == "Ios" ){
				return "br.com.johnhenrique.ello33";
			}else if( phonon.device.os == "Windows" ){
				return "https://www.microsoft.com/store/apps/9nblggh4rx56";
			}else{
				// qualquer outro sistema
				return "br.com.johnhenrique.ello33";
			}
		},
		
		geolocalizacao: function(){
			return localStorage.getItem('geolocalizacao');
		}
	}
	
});

