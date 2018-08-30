/**
 * Mapas
 * 
 * mapa.mapa( '-18.4476440 -50.4551600', 'Meu teste' )
 * mapa.distancia( '-18.4476440 -50.4551600', 'Meu teste' )
 * 
 * @example https://github.com/danielemoraschi/maplace.js
 **/
$(function(){
	
	
	mapa = {
		
		
		init: function(){
			
			console.log( "Mapa.js" );
			
			var scripts = [
				"https://maps.googleapis.com/maps/api/js?key=AIzaSyAavRXtF8sOL0Ak4eJxo3Dq51c2tKa2gJ4",
				"js/lib/maplace.min.js",
			];
			
			$.getScript(
				scripts[0], function(){
					console.log(scripts[0]);
					$.getScript(
						scripts[1], function(){
							console.log(scripts[1]);
							// load all dependences
							console.log( "Dependencias de mapa carregados");
						}
					);
				}
			);
			
		},
		
		
		mapa: function( localizacao, titulo ){

			if( localizacao ){
				geo = localizacao.split( ' ' );
				
				//console.log( geo[0] );
				
				lat 		 = 0;
				lon 		 = 0;
				localizacoes = [{
							lat: geo[0],
							lon: geo[1],
							title: titulo,
							//html: '<p>'+ titulo +'</p>',
							visible: true,
							zoom: 16,
							autoscale: false, 
							//icon: 'img/icon-localizacao.png',
							//icon: 'img/icon-pointer.png'
						}];
				
				// tenta recuperar a logalização
				localizacao_usuario = config.geolocalizacao();
				local = localizacao_usuario.split( ' ' );
				
				lat = local[0];
				lon = local[1];
				
				if( local.length == 2 ){
					//console.log( "Local" );
					//console.log( localizacao_usuario );
					
					localizacoes.push({
							lat: lat,
							lon: lon.trim(),
							title: "Eu",
							html: '<h3>Eu</h3>',
							//visible: true,
							//icon: 'img/icon-pointer.png'
						});
				}
				
				//console.log( localizacoes );
				
				setTimeout(function(){
				new Maplace({
					locations: localizacoes,
					map_div: '#gmap',
					generate_controls: false,
					controls_on_map: false, 
					show_markers: false, 
					set_center: [geo[0], geo[1]], 
					autoscale: false, 
					zoom: 16, 
					type: 'directions',
					//directions_panel: '#route',
					afterRoute: function(distance, status, result ) {
						//$( elemento ).text(': '+ parseInt(distance/1000)+'km');
						
						console.log( status );
							console.log( distance );
							console.log( result );
						
						if( status != 'ZERO_RESULTS' ){
							/*
							console.log( distance );
							console.log( result.routes[0].legs[0].distance.text );
							console.log( result.routes[0].legs[0].duration.text );
							*/
							return parseInt(distance/1000)+'km';
						}else{
							return '';
						}
					}
				}).Load();
				
				},1000);
			}
		},
		
		
		distancia: function( localizacao, titulo ){
			
			lat = 0;
			lon = 0;
			
			// tenta recuperar a logalização
			localizacao_usuario = config.geolocalizacao();
			local = localizacao_usuario.split( ',' );
			
			lat = local[0];
			lon = local[1];
			
			
			if( localizacao ){
				geo = localizacao.split( ' ' );
				
				
				if( undefined == lat ){
					lat = 0;
				}
				
				if( undefined == lon ){
					lon = 0;
				}
			
				new Maplace({
					locations: [
						{
							lat: geo[0],
							lon: geo[1].trim(),
							title: titulo,
							html: '<h3>'+ titulo +'</h3>',
							visible: true,
							/*
							zoom: 8, 
							autoscale: false, 
							 * */
							icon: 'img/icon-localizacao.png'
						},
						{
							lat: lat,
							lon: lon,
							title: "Eu",
							html: '<h3>Eu</h3>',
							visible: true,
							icon: 'img/icon-pointer.png'
						}
					],
					map_div: '#gmap',
					generate_controls: false,
					controls_on_map: false, 
					show_markers: false, 
					set_center: [geo[0], geo[1]], 
					autoscale: true, 
					zoom: 8, 
					type: 'directions',
					directions_panel: '#route',
					afterRoute: function(distance, status, result ) {
						//$( elemento ).text(': '+ parseInt(distance/1000)+'km');
						
						console.log( status );
							console.log( distance );
							console.log( result );
						
						if( status != 'ZERO_RESULTS' ){
							console.log( result.routes[0].legs[0].distance.text );
							console.log( result.routes[0].legs[0].duration.text );
							
							return parseInt(distance/1000)+'km';
						}else{
							return '';
						}
					}
				}).Load();
			}else{
				return '';
			}
		}
	}
});