 /*
 * Create a list that holds all of your cards
 */

 //meu dev
 
let arrayDeck = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-anchor", "fa-leaf", "fa-bicycle", "fa-diamond", "fa-bomb", "fa-leaf", "fa-bomb", "fa-bolt", "fa-bicycle", "fa-paper-plane-o", "fa-cube"];
let ulElement = document.querySelector('ul.deck');
let iElementsOpened = [];
let iElementsMatched = [];
let moves = 0;
let numeroDeEstrelas = $('li i.fa-star').length;
let eventoAnterior = 0;
let h=0;
let m=0;
let s=0;
let primeiroClick = true;
let hElement = document.querySelector('#hora');
let mElement = document.querySelector('#minuto');
let sElement = document.querySelector('#segundo');
let cronometro;


//iniciaOJogo(shuffle(arrayDeck));
iniciaOJogo(arrayDeck);
gerenciadorDeClicks();

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


function gerenciadorDeClicks(){
	//pq eu nao consigo customizar o function?
	$('li.card').click(function(clickEvent){

		//cronometro é iniciando somente no primeiro click
		if(primeiroClick)
			iniciarCronometro();

		abrirCarta(clickEvent);

		if(iElementsOpened.length===2){

			$('li.card').off();

			contaMovesECalculaEstrelas();		
					
			if(deuMatch())

				if(ganhouOJogo()){
					$('li.card').off();

					document.querySelector('.modal-tempo').textContent = 
						'Seu tempo foi: ' 
							+ h.toString().padStart(2,'0') 
							+ ':' + m.toString().padStart(2,'0')
							+ ':' + s.toString().padStart(2,'0');

					document.querySelector('.modal-movimentos').textContent = 
						'Você fez ' + moves + ' movimentos';

					$('.modal').modal('show');

					clearInterval(cronometro);

					setTimeout(refresh,5000);
				}

			desvirarCartasSemMatchDepoisDe1Segundo();
			
			setTimeout(gerenciadorDeClicks,1000)
		}
		primeiroClick=false;		
	});
	
}


function gerenciaEstrelas(){
	let numeroDeEstrelas = $('li i.fa-star').length;
	
	if(numeroDeEstrelas<3){
		$('ul.stars').remove();
		$('section.score-panel').append('<ul class="stars">'
			+ '<li><i class="fa fa-star"></i></li>'
			+ '<li><i class="fa fa-star"></i></li>'
			+ '<li><i class="fa fa-star"></i></li></ul>');
	}
	
}

function contaMovesECalculaEstrelas(){
	$('.moves').text(++moves);
	switch(moves){
		case 7: 
			$('ul.stars').children('li').first().remove();
			break;
		case 12:
			$('ul.stars').children('li').first().remove();
			break;
	}
}

		

function abrirCarta(eventoAtual){

	if(eventoAtual.target!==eventoAnterior.target){
		$(eventoAtual.target).addClass('open');
		$(eventoAtual.target).addClass('show');

		iElementsOpened.push($(eventoAtual.target).children('i'));
	}
	
	eventoAnterior = eventoAtual;
}

function desvirarCartasSemMatchDepoisDe1Segundo(){
	setTimeout(function(){
		iElementsOpened[0].parent().toggleClass('open');
		iElementsOpened[0].parent().toggleClass('show');

		iElementsOpened[1].parent().toggleClass('open');
		iElementsOpened[1].parent().toggleClass('show');

		iElementsOpened = [];
	},1000);
}


function deuMatch(){
	if (  (iElementsOpened[0].attr('class')) === (iElementsOpened[1].attr('class'))   ){

		iElementsOpened[0].parent().toggleClass('match');
		iElementsOpened[1].parent().toggleClass('match');

		iElementsMatched.push(iElementsOpened[0]);
		iElementsMatched.push(iElementsOpened[1]);

		return true;
	}
	else{
		return false;
	}
}


//Porque esse if ternario nao deu certo?
//iElementsMatched.length===6 ? (return true) : (return false);	
function ganhouOJogo(){
	if(iElementsMatched.length === 6){
		iElementsMatched = [];
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

// $('div.restart').click(function(){
// 	moves=0;
// 	$('.moves').text(0);
// 	$('li.card').remove();
// 	iniciaOJogo(shuffle(arrayDeck));
// 	gerenciadorDeClicks();
// });


$('div.restart').click(function(){
	clearInterval(cronometro);
	refresh();
});


function refresh(){
	$('li.card').remove();
	 
	moves=0;
	s=0;
	m=0;
	h=0;
	
	sElement.textContent = s.toString().padStart(2,'0');
	mElement.textContent = m.toString().padStart(2,'0');
	hElement.textContent = h.toString().padStart(2,'0');

	$('.moves').text(0);
	primeiroClick = true;
	iniciaOJogo(shuffle(arrayDeck));
	gerenciadorDeClicks();
}



//isso nao funcionou. Pq?
function iniciar(){
	shuffle(arrayDeck);

	let ulElement = $('ul.deck');
	
	$.each(arrayDeck,function(index, value){
		console.log(index +" >> "+ value);
				
		ulElement.append('<li class="card"></li>');
		let liElement = ulElement.children('li').first(); 
		liElement.append('<i></i>');
		let iElement = liElement.children('i').first();
				iElement.addClass('fa');
		iElement.addClass(value);
		
		//console.log(ulElement);
		//console.log(liElement);
		//console.log(iElement);
		//console.log('-----------------------------------');
	});
}//fim iniciar 

