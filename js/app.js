
let arrayDeck = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-anchor", "fa-leaf", "fa-bicycle", "fa-diamond", "fa-bomb", "fa-leaf", "fa-bomb", "fa-bolt", "fa-bicycle", "fa-paper-plane-o", "fa-cube"];
let ulElement = document.querySelector('ul.deck');
let cartasViradas = [];
let cartasMatched = [];
let eventosIguais = [];
let moves = 0;
let numeroDeEstrelas = $('li i.fa-star').length;
let eventoAnterior = null;
let eventoAtual;
let h=0;
let m=0;
let s=0;
let primeiroClick = true;
let hElement = document.querySelector('#hora');
let mElement = document.querySelector('#minuto');
let sElement = document.querySelector('#segundo');
let cronometro;

iniciaOJogo(shuffle(arrayDeck));

function iniciaOJogo(arrayDeck){

	gerenciaEstrelas();

	arrayDeck.forEach(function(arrayDeck){
		let liElement = document.createElement('li');
		liElement.classList.add('card');
		
		let iElement = document.createElement('i');
		iElement.classList.add('fa')
		iElement.classList.add(arrayDeck);

		liElement.append(iElement);
		ulElement.append(liElement);
	});
}
	
function cronometrar(){
		s++;

		if (s==60) {
			s=0;
			m++;
		}

		if (m==60) {
			m=0;
			h++;
		}
		sElement.textContent = s.toString().padStart(2,'0');
		mElement.textContent = m.toString().padStart(2,'0');
		hElement.textContent = h.toString().padStart(2,'0');
}



function iniciarCronometro(){
	cronometro = setInterval(cronometrar,1000);
}


function gerenciadorDeClicks(clickEvent){
	
	eventoAtual = clickEvent.target;
		
	if(eventoAtual === eventoAnterior)
			eventosIguais.push(eventoAtual);

	if(primeiroClick)
		iniciarCronometro();

	if (eventosIguais.length < 2){
		abrirCarta();

		if(cartasViradas.length===2){
			$('li.card').off();

			contaMovimentosEEstrelas();		
						
			if(deuMatch())

				if(ganhouOJogo()){
					$('li.card').off();

					exibirModal();

					clearInterval(cronometro);

					setTimeout(refresh,3000);
				}
			setTimeout(desvirarAsCartas,500);
			setTimeout(reiniciarGerenciadorDeClicks,600);
		}
			
	}
	eventosIguais = [];
	primeiroClick=false;
	eventoAnterior = eventoAtual;
}

function reiniciarGerenciadorDeClicks(){
	$('li.card').click(gerenciadorDeClicks);
}


function abrirCarta(){

	$(eventoAtual).addClass('open');
	$(eventoAtual).addClass('show');

	if (eventoAtual!== eventoAnterior )
		cartasViradas.push($(eventoAtual).children('i'));
}

function deuMatch(){

	if (  (cartasViradas[0].attr('class')) 
			=== (cartasViradas[1].attr('class')) 
			&&  eventoAtual !== eventoAnterior ){

		cartasViradas[0].parent().toggleClass('match');
		cartasViradas[1].parent().toggleClass('match');

		cartasMatched.push(cartasViradas[0]);
		cartasMatched.push(cartasViradas[1]);

		return true;
	}
	else{
		return false;
	}
}


function totalDeEstrelas(){
	return $('li i.fa-star').length;
}

function exibirModal(){
	
	document.querySelector('.modal-tempo').textContent = 
							'Seu tempo foi: ' 
								+ h.toString().padStart(2,'0') 
								+ ':' + m.toString().padStart(2,'0')
								+ ':' + s.toString().padStart(2,'0');

	document.querySelector('.modal-movimentos').textContent = 'Você ganhou com '
							+ moves + ' movimentos e '
							+ totalDeEstrelas() + ' estrelas!';
							
	$('.modal').modal('show');
}


function gerenciaEstrelas(){
	//let numeroDeEstrelas = $('li i.fa-star').length;
	
	if(totalDeEstrelas()<3){
		$('ul.stars').remove();
		$('section.score-panel').append('<ul class="stars">'
			+ '<li><i class="fa fa-star"></i></li>'
			+ '<li><i class="fa fa-star"></i></li>'
			+ '<li><i class="fa fa-star"></i></li></ul>');
	}
}

function contaMovimentosEEstrelas(){
	$('.moves').text(++moves);
	switch(moves){
		case 14: 
			$('ul.stars').children('li').first().remove();
			break;
		case 20:
			$('ul.stars').children('li').first().remove();
			break;
	}
}


function desvirarAsCartas(){
	cartasViradas[0].parent().toggleClass('open');
	cartasViradas[0].parent().toggleClass('show');

	cartasViradas[1].parent().toggleClass('open');
	cartasViradas[1].parent().toggleClass('show');

	cartasViradas = [];
	eventoAtual = null;
	eventoAnterior = null;
}

//Porque esse if ternario nao deu certo?
//cartasMatched.length===6 ? (return true) : (return false);	
function ganhouOJogo(){
	if(cartasMatched.length === 16){
		cartasMatched = [];
		return true; 
	}		
	else
		return false;
}


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
   + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


$('div.restart').click(function(){
	clearInterval(cronometro);
	refresh();
});


$('li.card').click(gerenciadorDeClicks);


function refresh(){
	$('li.card').remove();
	 
	moves=0;
	s=0;
	m=0;
	h=0;
	cartasMatched =[];
	
	sElement.textContent = s.toString().padStart(2,'0');
	mElement.textContent = m.toString().padStart(2,'0');
	hElement.textContent = h.toString().padStart(2,'0');

	$('.moves').text(0);
	primeiroClick = true;
	iniciaOJogo(shuffle(arrayDeck));
	$('li.card').click(gerenciadorDeClicks);
}




