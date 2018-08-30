$(function(){
	
	configuracoes = {
		
		init:function(){
			
			/*
			$( document ).on( 'click', 'configuracoes .btn-salvar', function(){
				console.log( "enviando area vida" );
				configuracoes.adicionar();
			});
			
			
			$( document ).on( 'click', 'configuracoes .cores img', function(){
				console.log( "Selecionando cores do tema" );
				configuracoes.seleciona_tema( this );
			});
			*/
			
			
			
			
		},
		
		
		adicionar: function(){
			
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