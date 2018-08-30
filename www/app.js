

document.on( 'pageopened', function( evt ){
	console.log( "Page opened "+ evt.detail.page );
	
	
	/**
	 * Atualizando tema
	 * */
	if( ( localStorage.getItem( 'tema' ) != undefined ) && ( localStorage.getItem( 'tema' ) != null ) ){
		tema = localStorage.getItem( 'tema' );
		
		$( document ).find( '#css' ).prop( 'href', 'css/'+ tema +'.css' );
	};
	
	
	
	/**
	 * Verificando se está logado
	 * */
	login.esta_logado();
});



	
	phonon.options({
		navigator: {
			defaultPage: ( localStorage.getItem( 'telefone' ) == undefined )? 'login':'principal',
			hashPrefix: '!', 
			animatePages: true,
			enableBrowserBackButton: true,
			templateRootDirectory: './telas',
			useHash: true
		}
		
	});


	// atalho para acessar a classe
	app = phonon.navigator();


	app.on({page:'login', content:'login.html', preventClose:false, readyDelay:1}, function(act){
		
		act.onCreate(function(){
			
			login.init();
		});
		
		
		act.onReady(function(){
			$( 'login .telefone, #chave_acesso' ).text( login.getTelefone() );
			$( '#chave_acesso' ).val( login.getTelefone() );
		});
	});


	app.on({page: 'principal', content: 'principal.html', preventClose: false, readyDelay: 1}, function(activity){
		
		activity.onCreate(function(){
			
			
			// conta todas as mensagens não lidas
			funcoes.totalMsg();
			
			//contatos.init();
			
			//chamadas.init();
			
			funcoes.salva_avatar();
			funcoes.salva_nome();
			funcoes.salva_contato_id();
			
			mensagem.init();
			
			funcoes.init();
			
			contato.init();
		});
		
		
		
		activity.onReady(function(){
			
			// lista todas as mensagens recentes
			mensagem.listar();
			
			// lista todos os contatos
			contato.listar();
		});

		//activity.onTransitionEnd(function(){});

		activity.onTabChanged(function(){
			
			$( document ).on( 'click', '.tab-items a', function(){
				
				elemento = $( this ).attr( 'id' );
				
				// exibe no console o ID da aba clicada
				//console.log( "aba #"+ elemento );
				
				
				// remove a class de todos os itens
				$( '.tab-item' ).removeClass( 'ativo' );
				$( '.tab-item span' ).removeClass( 'ativo' );
				
				// adiciona a classe no item clicado
				$( '#'+ elemento ).addClass( 'ativo' );
				
				// verificando se foi clicado na aba conversas
				if( elemento == 'conversas' ){
					$( '.msg-nao-lido-total' ).addClass( 'ativo' );
				}
			});
			
		});
	});




	app.on({page: 'privado', content: 'privado.html', preventClose: true, readyDelay: 1}, function(activity){
		
		activity.onCreate(function(){
			funcoes.botao_enviar();
			
			mensagem.init();
		});
		
		
		
		activity.onReady(function(){
			
			alvo = $( 'privado .contato.info' );
			
			nome = funcoes.pega_nome();
			contato_id = funcoes.pega_contato_id();
			
			// recupera o telefone do contato baseado no contato_id
			telefone_contato = getContatoTelefone();
			
			alvo.html( nome +"<span>Desconhecido</span>" );
			alvo.attr( 'href', '#!perfil/'+ localStorage.getItem( 'contato_id' ) +'/'+ nome );
			
			
			mensagem.listar_privado( contato_id );
		});
		
		
		
		activity.onHashChanged(function( post_ID, usuario_nome, telefone_destino ){
			
			$( '.telefone_autor' ).val( login.getTelefone() );
			
			if( $.isNumeric( usuario_nome ) ){
				contato_info = "Desconhecido"; //exibe quando o usuário não é um contato da agenda
			}else{
				contato_info = telefone_destino;
			}
			
			// adicionando o titulo da janela
			$( 'privado .contato' ).html( usuario_nome +"<span>"+ contato_info +"</span>" );
			
			$( '.post_ID' ).val( post_ID );
			
			$( '.nome' ).val( usuario_nome );
			
			avatar = funcoes.pega_avatar();
			if( avatar == undefined ){
				avatar = 'img/icones/avatar.png';
			}
			$( 'privado .perfil' ).attr( 'src', avatar );
			
			if( telefone_destino != undefined ){
				//$( 'privado a.telefone' ).attr( 'href', 'tel:'+ telefone_destino );
				
				$( '.telefone' ).val( telefone_destino );
			}
			
		});
		
		
		// fecha a janela, permite executar um código antes de fechar
		activity.onClose(function(self){
			
			console.log( "limpando mensagens close");
			// evita que a reprodução continue após sair da janela privado
			$( '#mensagens' ).text('');
			
			self.close();
		});
		
		
		activity.onHidden(function(){
			console.log( "limpando mensagens hidden");
			$( '#mensagens' ).text('');
		});
		
		//activity.onTabChanged(function(){});
	});


	app.on({page: 'criargrupo', content: 'criargrupo.html', preventClose: false, readyDelay: 1}, function(activity){

		activity.onCreate(function(){
			criargrupo.init();
		});

		activity.onReady(function(){
			//criargrupo.copiar_lista_contatos();
		});
	});


	
	app.on({page: 'grupo', content: 'grupo.html', preventClose: false, readyDelay: 1}, function(activity){
		
		activity.onCreate(function(){
			grupo.init();
			
			funcoes.botao_enviar();
		});
		
		activity.onReady(function(){

			alvo = $( 'grupo .contato.info' );
			
			nome = funcoes.pega_nome();
			
			
			alvo.html( nome +"<span>Desconhecido</span>" );
			alvo.attr( 'href', '#!perfilgrupo/'+ localStorage.getItem( 'contato_id' ) +'/'+ nome );
		});
		
		
		
		activity.onHashChanged(function( post_ID, usuario_nome, telefone_destino ){
			
			$( '.telefone_autor' ).val( login.getTelefone() );
			
			if( $.isNumeric( usuario_nome ) ){
				contato_info = "Desconhecido"; //exibe quando o usuário não é um contato da agenda
			}else{
				contato_info = telefone_destino;
			}
			
			// adicionando o titulo da janela
			$( 'grupo .contato' ).html( usuario_nome +"<span>"+ contato_info +"</span>" );
			
			$( '.post_ID' ).val( post_ID );
			
			$( '.nome' ).val( usuario_nome );
			
			avatar = funcoes.pega_avatar();
			if( avatar == undefined ){
				avatar = 'img/icones/avatar.png';
			}
			$( 'grupo .perfil' ).attr( 'src', avatar );
			
			if( telefone_destino != undefined ){
				//$( 'grupo a.telefone' ).attr( 'href', 'tel:'+ telefone_destino );
				
				$( '.telefone' ).val( telefone_destino );
			}
			
		});
		
		
		// fecha a janela, permite executar um código antes de fechar
		activity.onClose(function(self){
			
			// evita que a reprodução continue após sair da janela grupo
			//funcoes.parar_midia();
			//$( '#mensagens' ).text('');
			
			self.close();
		});
		
		//activity.onTabChanged(function(){});
	});
	
	
	
	
	app.on({page: 'perfilgrupo', content: 'perfilgrupo.html', preventClose: false, readyDelay: 1}, function(activity){

		activity.onCreate(function(){
			grupo.init();
		});

		activity.onReady(function(){
			
			$( 'perfilgrupo .header-bar' ).css( 'background-image', 'url("'+ localStorage.getItem('contato_avatar') +'")' )
									 .css( 'background-position', 'top center' )
									 .css( 'background-repeat', 'no-repeat' );
			
			
			$( 'perfilgrupo .contato.info' ).html( funcoes.pega_nome() +"<span>Desconhecido</span>" );
		});

		activity.onTransitionEnd(function(){});

		activity.onHidden(function(){
			// isso não remove apenas a imagem  --'
			$( 'perfilgrupo .header-bar' ).css( 'background-image', 'none' );
		});

		activity.onHashChanged(function(paramentro){});

		activity.onTabChanged(function(){});
	});
	
	
	
	
	app.on({page: 'perfil', content: 'perfil.html', preventClose: false, readyDelay: 1}, function(activity){

		activity.onCreate(function(){
		});

		activity.onReady(function(){
			
			$( 'perfil .header-bar' ).css( 'background-image', 'url("'+ localStorage.getItem('contato_avatar') +'")' )
									 .css( 'background-position', 'top center' )
									 .css( 'background-repeat', 'no-repeat' );
			
			
			$( 'perfil .contato.info' ).html( funcoes.pega_nome() +"<span>Desconhecido</span>" );
			
			mapa.distancia( '-18.4476440, -50.4551600', 'Meu teste' );
		});

		activity.onTransitionEnd(function(){});

		activity.onHidden(function(){
			// isso não remove apenas a imagem  --'
			$( 'perfil .header-bar' ).css( 'background-image', 'none' );
		});

		activity.onHashChanged(function(paramentro){});

		activity.onTabChanged(function(){});
	});
	
	
	
	
	
	
	
	
	app.on({page: 'contatos', content: 'contatos.html', preventClose: true, readyDelay: 1}, function(activity){
		
		activity.onCreate(function(){
			
			contato.init();
		});
		
		
		
		activity.onReady(function(){
			
			$( '.search-input' ).val('').hide();
			
			contato.listar();
			
			// total de contatos
			$( '.contatos-total' ).text( getTotalContatos() );
		});
		
		
		activity.onClose(function( self ){
			
			$( '.search-input' ).val('').hide();
			$( 'contatos .icon-search' ).show();
			$( 'contatos .info' ).show();
			
			self.close()
		});
	});
	
	
	
	app.on({page: 'criarcontato', content: 'criarcontato.html', preventClose: true, readyDelay: 1}, function(activity){
		
		activity.onCreate(function(){
			
			contato.init();
		});
		
		
		
		activity.onReady(function(){
			
			$( 'criarcontato .header-bar' ).css( 'background-image', 'url("img/icones/icon-usuario-novo.png")' )
									 .css( 'background-position', 'top center' )
									 .css( 'background-repeat', 'no-repeat' );
		});
		
		
		activity.onHidden(function(){
			console.log( 'onHidden');
		});
		
		activity.onClose(function( self ){
			
			// limpar todos os campos
			self.close()
			console.log( 'onClose');
		});
	});
	
	
	
	
	app.on({page: 'configuracoes', content: 'configuracoes.html', preventClose: false, readyDelay: 1}, function(activity){

		activity.onCreate(function(){
			configuracoes.init();
			compartilhar.init();
		});

		activity.onReady(function(){});
		
		activity.onHidden(function(){});
	});
	
	
	
	
	app.on({page: 'perfilusuario', content: 'perfilusuario.html', preventClose: false, readyDelay: 1}, function(activity){

		activity.onCreate(function(){});

		activity.onReady(function(){});
		
		activity.onHidden(function(){});
	});
	
	
	
	
	app.on({page: 'cores', content: 'cores.html', preventClose: false, readyDelay: 1}, function(activity){

		activity.onCreate(function(){
			cores.init();
		});

		activity.onReady(function(){});
		
		activity.onHidden(function(){});
	});
	
	
	
	
	app.on({page: 'criargrupo', content: 'criargrupo.html', preventClose: false, readyDelay: 1}, function(activity){

		activity.onCreate(function(){});

		activity.onReady(function(){
			
		});
		
		activity.onHidden(function(){});
	});
	
	
	
$(function(){
	document.addEventListener('deviceready', function () {
		initDatabase();
		
		mapa.init();
		
		app.start();
	});
});