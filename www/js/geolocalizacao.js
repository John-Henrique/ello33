/**
 * Permite utilizar os recursos do GPS
 * 
 * 
 * @see https://github.com/apache/cordova-plugin-geolocation
 **/
$(function(){
	
	var permissions;
	
	
	geolocalizacao = {
		
		init: function(){
			//console.log( "Geolocalização init.js");
			
			//permissions = cordova.plugins.permissions;
			
			
			//permissions.checkPermission( permissions.GPS)
			//navigator.geolocation.getCurrentPosition( geolocalizacao.sucesso, geolocalizacao.falha );
			navigator.geolocation.watchPosition( geolocalizacao.sucesso, geolocalizacao.falha, { timeout: 30000, enableHighAccuracy: true } );
		},
		
		
		sucesso: function( posicao ){
			
			latitude 	= posicao.coords.latitude;
			longitude 	= posicao.coords.longitude;
			
			// permite acessar a informação através do config.geolocalizacao()
			localStorage.setItem( 'geolocalizacao', latitude +', '+ longitude );
			
			//phonon.notif( "geolocalizacao: "+ latitude +' '+ longitude, 1000, false );
			
			return latitude +', '+ longitude;
		},
		
		
		falha: function( erro ){
			//console.log( "falha" );
			//phonon.notif( "Não foi possivel utilizar o GPS: "+ erro.message, 5000, false );
			//phonon.notif( erro.message, 5000, false );
		},
		
		
		
		/**
		 * Retorna a distância entre 2 pontos 
		 * baseado na formula de Haversine
		 * 
		 * @see http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
		 * @ponto1 Latitude e longitude inicial
		 * @ponto2 Latitude e longitude final
		 **/
		distancia: function( ponto1, ponto2 ){
			
			//console.log( "Ponto1: "+ ponto1 );
			//console.log( "Ponto2: "+ ponto2 );
			
			if( ponto1 != '' && ponto1 != null && ponto2 != '' && ponto2 != null ){
				
				// verificando se existe virgulana coordenada
				if( ponto1.indexOf( ',' ) == -1 ){
					p1 = ponto1.split( ' ' );
				}else{
					p1 = ponto1.split( ',' );
				}
				
				p2 = ponto2.split( ',' );
				
				lat1 = p1[0];
				lon1 = p1[1];
				
				lat2 = p2[0];
				lon2 = p2[1];
				
				var R = 6371; // Radius of the earth in km
				var dLat = geolocalizacao.deg2rad(lat2-lat1);  // geolocalizacao.deg2rad below
				var dLon = geolocalizacao.deg2rad(lon2-lon1); 
				var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(geolocalizacao.deg2rad(lat1)) * Math.cos(geolocalizacao.deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
				var d = parseInt( R * c ); // Distance in km
				
				//console.log( "Distancia: "+ d +" km" );
				return d +" km";
			}else{
				return '';
			}
		},
		
		deg2rad: function(deg) {
			return deg * (Math.PI/180)
		}
		
	}
	
	
	
	
	
	// iniciando a classe
	document.addEventListener( "deviceready", geolocalizacao.init, false );
});
