/**
controla os eventos online, offline, backbutton
é necessário instalar o plugin 
	CORDOVA-PLUGIN-DIALOGS
	 * 
	
	// habilitando o funcionamento em background usando o plugin https://github.com/tomloprod/cordova-plugin-appminimize
	// para permanecer em background precisa do app https://github.com/katzer/cordova-plugin-background-mode
	 * 
	 * Para saber se está online ou offline
	https://github.com/apache/cordova-plugin-network-information
	 * 
	 * 
	// bloqueando a tela na posição retrato
	https://github.com/apache/cordova-plugin-screen-orientation
	
*/
$(function(){
	
	document.addEventListener( 'deviceready', app_init, false );

	function app_init(){
		//navigator.notification.alert( 'app iniciado', false, "Aviso", 'Ok' );
		
		document.addEventListener( 'online', 		app_online, false );
		document.addEventListener( 'offline', 		app_offline, false );
		document.addEventListener( 'backbutton', 	app_backbutton, false );
		document.addEventListener( 'pause', 		app_pause, false );
		document.addEventListener( 'resume', 		app_resume, false );
		
		
		// trava a tela no modo 
		screen.orientation.lock('portrait');
		
		
		// recuperando a versão do app
		cordova.getAppVersion.getVersionNumber().then(function (version) {
			$('.versao').text(version);
		});
	}


	function app_offline(){
		//notif = phonon.notif( "Falha na conexão, a internet parou!", 4000, false );
		//notif.setColor( 'negative' );
	}
	
	function app_online(){
		//phonon.notif( "uhuuu, a internet voltou!", 4000, false );
	}
	
	function app_backbutton(){
		tela = phonon.navigator().currentPage;
		
		if( ( tela == 'principal' ) || ( tela == 'login' )){
			
			//phonon.notif( "Tela atual "+ tela,3000 );
			exitAppPopup();
		}else{
			//history.back();
		}
	}
	
	function app_pause(){
		//navigator.notification.alert( 'app pausado "pause"', false, "Aviso", 'Ok' );
		// habilitando background mode
		//cordova.plugins.backgroundMode.enable();
	}
	
	function app_resume(){
		//phonon.notif( "Bem vindo de volta", 4000, false );
		//cordova.plugins.backgroundMode.disable();
	}
	
	
	
	
	
	
	function exitAppPopup() {
		navigator.notification.confirm(
			'Sair do app?'
				, function(button){
					if(button == 2){
						
						// habilitando o funcionamento em background usando o plugin https://github.com/tomloprod/cordova-plugin-appminimize
						// para permanecer em background precisa do app https://github.com/katzer/cordova-plugin-background-mode
						//window.plugins.appMinimize.minimize();
						navigator.app.exitApp();
					}else if( button == 3 ){
						location.replace( config.app_id() );
					}else{
						
					}
				}
				, 'Sair'
				, ['Não','Sim','Avaliar']
			);  
		return false;
	}
});