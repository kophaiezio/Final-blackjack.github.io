const app = function () {
    const game = {};
    const suits = ["spades","hearts","clubs","diams"];
    const ranks = ["A",2,3,4,5,6,7,8,9,10,"J","Q","K"];
    const score = [0,0];
    //const ranks = ["A",10,10,10];  

    function init() {
        //console.log("init ready");
        game.cash = 200;
        game.bet = 0;
        buildGameDeck();
        turnOff(game.btnHit);
        turnOff(game.btnStand);
        turnOff(game.btnDoubleDown)
        
        buildDeck();
        addCliker();
        scoreBoard();
        updateCash();


    }
    function updateCash() {
        console.log(isNaN(game.inputBet.value));
        if(isNaN(game.inputBet.value)|| game.inputBet.value.length <1){
            game.inputBet.value = 0;
        }
        let betAmount = Number(game.inputBet.value);

        if(game.inputBet.value > game.cash){
            game.inputBet.value = game.cash;
        }
        game.bet = Number(game.inputBet.value);
        game.playerCash.textContent = "Player cash $"+(game.cash - game.bet);

    }
    function lockWager(tog){
        game.inputBet.disabled = tog;
        game.btnBet.disabled = tog;
        if(tog){
            game.btnBet.style.backgroundColor = "#5cb85c";
            game.inputBet.style.backgroundColor = "#ddd";
        } else {
            game.btnBet.style.backgroundColor = "#ddd";
            game.inputBet.style.backgroundColor = "#fff";
        }
    }
    function setBet(){
        if (game.bet <= 0) {
            game.status.textContent = "Please bet in advance.";
            lockWager(false);
            return;
        }

        game.status.textContent = "You bet $"+game.bet;
        game.cash = game.cash - game.bet;
        game.playerCash.textContent = "Player cash $"+game.cash;
        lockWager(true);
    }


    function scoreBoard(){
        game.scoreboard.textContent = `Dealer ${score[0]} vs Player ${score[1]}`;

    }

    function addCliker() {
        game.btnDeal.addEventListener('click',deal);
        game.btnStand.addEventListener('click',playerStand);
        game.btnHit.addEventListener('click',nextCards);
        game.btnDoubleDown.addEventListener('click', doubleDown);
        game.btnBet.addEventListener('click',setBet);
        game.inputBet.addEventListener('change',updateCash);
        game.btnHowToPlay.addEventListener('click',showHowToPlay);
        

    }
    function showHowToPlay() {
        const instructions = document.getElementById('instructions');
        instructions.style.display = instructions.style.display === "none" ? "block" : "none";
    }


    function deal() {
        if (game.bet <= 0) {
            game.status.textContent = "Please bet in advance.";
            lockWager(false);
            return;
        }



        game.dealerHand = [];
        game.playerHand = [];
        game.dealerScore.textContent = "*";
        game.start = true;
        lockWager(true);
        turnOff(game.btnDeal);
        game.playerCards.innerHTML = "";
        game.dealerCards.innerHTML = "";
        takeCard(game.dealerHand,game.dealerCards,true);
        takeCard(game.dealerHand,game.dealerCards,false);
        takeCard(game.playerHand,game.playerCards,false);
        takeCard(game.playerHand,game.playerCards,false);

        updateCount();
        
        if (game.playerHand.length == 2) {
            turnOn(game.btnDoubleDown);
            let playerTotal = scorer(game.playerHand);
            if (playerTotal === 21) { // Check for Blackjack (A + 10)
                turnOff(game.btnDoubleDown);
            }
        }



    }

    

    function playerStand() {
        dealerPlay();
        turnOff(game.btnHit);
        turnOff(game.btnStand);
        turnOff(game.btnDoubleDown);
        

    }

    function nextCards() {
        takeCard(game.playerHand,game.playerCards,false);
        updateCount();

    }

    function doubleDown() {
        if (game.bet * 2 > game.cash) {
            game.status.textContent = "Not enough cash to double down.";
            return;
        }
    
        game.bet *= 2;
        game.cash -= game.bet + game.bet / 2; // Subtract the additional bet amount
        game.playerCash.textContent = "Player cash $" + game.cash;
        takeCard(game.playerHand, game.playerCards, false);
        updateCount();
        turnOff(game.btnDoubleDown);
        turnOff(game.btnHit);
        turnOn(game.btnStand);
        game.status.textContent =" Player Bet now is " + (game.bet + game.bet / 2)+"$" +" Stand to find Winners";

        let player = scorer(game.playerHand);
        if (player > 21) {
            game.status.textContent =" Player Bet now is " + (game.bet + game.bet / 2)+"$"+". " ;
            findWinner();
        }

    }






    function findWinner() {
        let player = scorer(game.playerHand);
        let dealer = scorer(game.dealerHand);
        console.log(player, dealer);

        if (player == 21 && game.playerHand.length == 2 && dealer == 21 && game.dealerHand.length == 2) {
            let playerSuitValue = getHighestSuitValue(game.playerHand);
            let dealerSuitValue = getHighestSuitValue(game.dealerHand);
    
            if (playerSuitValue > dealerSuitValue) {
                game.status.textContent = "Both have Blackjack, but Player's suit is higher. Player wins!";
                game.cash = game.cash + (game.bet * 2.5); // Trả 3/2 số tiền cược
                score[1]++;
            } else if (playerSuitValue < dealerSuitValue) {
                game.status.textContent = "Both have Blackjack, but Dealer's suit is higher. Dealer wins!";
                score[0]++;
            } else {
                game.status.textContent = "Both have Blackjack with equal suits. It's a tie!";
                game.cash = game.cash + game.bet;
            }
        } else {


            if(player>21){
                game.status.textContent = "You buster with "+player+" ";
            }
            else if(dealer>21){
                game.status.textContent = "Dealer buster with " +dealer+" ";
            }
            if(player == dealer){
                game.status.textContent = "Draw no winers" +player+" ";
                game.cash += (game.bet * 2) ;
            }
            else if((player <22 && player > dealer)|| dealer>21){
                
                game.status.textContent += "You win with "+player+" ";
                game.cash = game.cash + (game.bet *2);
                score[1]++;
            }
            else{
                game.status.textContent += "Dealer win with "+dealer+" ";
                score[0]++;
            }
            if(game.cash <1){
                game.cash = 0;
                game.bet = 0;
            }
        }
        game.bet = 0;
        game.inputBet.value = 0;

        updateCash();
        scoreBoard();
        lockWager(false);
        turnOff(game.btnHit);
        turnOff(game.btnStand);
        turnOff(game.btnDoubleDown);
        turnOn(game.btnDeal);

        


    }
    // Hàm lấy giá trị cao nhất của chất bài
    function getHighestSuitValue(hand) {
        const suitValues = { "spades": 1, "hearts": 4, "clubs": 2, "diams": 3 };
        let maxSuitValue = 0;
        hand.forEach(function (card) {
            if (suitValues[card.suit] > maxSuitValue) {
                maxSuitValue = suitValues[card.suit];
            }
        });
        return maxSuitValue;
    }





    function dealerPlay() {
        let dealer = scorer(game.dealerHand);
        game.cardBack.style.display = "none";
        console.log(dealer);
        game.status.textContent = "Dealer score"+dealer+" ";
        if(dealer > 17){
            game.dealerScore.textContent = dealer;
            findWinner();
        }
        else{
            takeCard(game.dealerHand,game.dealerCards,false);
            game.dealerScore.textContent = dealer;
            dealerPlay();
        }
    }








    function updateCount() {
        let player = scorer(game.playerHand);
        let dealer = scorer(game.dealerHand);
        console.log(player, dealer);
        game.playerScore.textContent = player;
        if(player < 21){
            turnOn(game.btnHit);
            turnOn(game.btnStand);
            game.status.textContent = "Stand or take another card";
        }
        else if(player >21){
            findWinner();
        }
        else{
            game.status.textContent = "Dealer in Play to 17 minimum";
            dealerPlay(dealer);
        }
        if(dealer ==21 && game.dealerHand.length == 2){
            game.status.textContent = "Dealer got BlackJack ";
            game.cardBack.style.display = "none";
            turnOff(game.btnDoubleDown);
            gameEnd();
            findWinner();
        }
        // Kiểm tra nếu player có Blackjack với 2 lá đầu tiên
        if (player === 21 && game.playerHand.length === 2) {
            turnOff(game.btnHit); // Không cho chia thêm bài cho player
            game.cardBack.style.display = "none"; // Hiện hết bài của dealer
            gameEnd();
            findWinner(); // Tìm người thắng cuộc
        }    

    }
    function scoreAce(val,aces) {
        if(val<21){
            return val;
        }
        else if(aces > 0 ){
            aces --;
            val = val-10;
            return scoreAce(val,aces);
        }
        else{
            return val;
        }
    }

    function scorer(hand) {
        let total = 0;
        let ace = 0;
        hand.forEach(function(card){
            console.log(card);
            if(card.rank == "A"){
                ace++;
            }
            total = total + Number(card.value);
        })
        if(ace >0 && total > 21){
            total = scoreAce(total, ace);
        }
        if(total >21){
            gameEnd();
            return Number(total);
        }
        
        
        
        //console.log(hand);
        return Number(total);



    }
    function gameEnd() {
        turnOff(game.btnHit);
        turnOff(game.btnStand);
        turnOff(game.btnDoubleDown);
        console.log('ended');
    }




    function takeCard(hand,ele, h){
        if(game.deck.length == 0){
            buildDeck();
        }
        let temp = game.deck.shift();
        console.log(temp);
        hand.push(temp);
        console.log(game);
        showCard(temp, ele);
        if(h){
            game.cardBack = document.createElement('div');
            game.cardBack.classList.add('cardB');
            ele.append(game.cardBack);
        }

    }

    function showCard(card,el) {
        if(card != undefined){
        //el.innerHTML = card.rank + "&" + card.suit + ";";
        el.style.backgroundColor = "white";
        let div = document.createElement("div");
        div.classList.add('card');
        if(card.suit === "hearts" || card.suit === "diams") {
            div.classList.add('red');

        }
        let span1 = document.createElement('div');
        span1.innerHTML = card.rank + "&" + card.suit + ";" ;
        span1.classList.add('tiny');
        div.appendChild(span1);


        let span2 = document.createElement('div');
        span2.innerHTML = card.rank ;
        span2.classList.add('big');
        div.appendChild(span2);

        let span3 = document.createElement('div');
        span3.innerHTML = "&" + card.suit + ";" ;
        span3.classList.add('big');
        div.appendChild(span3);

        el.appendChild(div);
        }
    }
   
    function turnOff(btn) {
        btn.disabled = true;
        btn.style.backgroundColor = "#6c757d";
    }
    function turnOn(btn) {
        btn.disabled = false;
        btn.style.backgroundColor = "#5cb85c";
    }





    function buildDeck() {
        game.deck = [];
        for(let i=0;i<suits.length;i++){
            for(let j =0;j <ranks.length;j++){
                
                let card = {};
                let tempValue = isNaN(ranks[j]) ? 10 : ranks[j];
                tempValue = (ranks[j] == "A") ? 11 : tempValue

                card.suit = suits[i];
                card.rank = ranks[j];
                card.value = tempValue;
                console.log(suits[i],ranks[j],tempValue);
                game.deck.push(card);

            }
        }
        shuffle(game.deck);
        console.log(game.deck);
    }

    function shuffle(cards) {
        cards.sort(function(){
            console.log(.5 - Math.random());
            return .5 - Math.random();
        })
        
    }



    function buildGameDeck() {
        game.main = document.querySelector('#game');
        console.log(game);

        // Create and append scoreboard
        game.scoreboard = document.createElement('div');
        game.scoreboard.textContent = "Dealer 0 vs Player 0";
        game.scoreboard.style.fontSize = "2em";
        game.main.append(game.scoreboard);

        // Create game table
        game.table = document.createElement('div');

        // Dealer section
        game.dealer = document.createElement('div');
        game.dealerCards = document.createElement('div');
        game.dealerCards.textContent = "Dealer card";
        game.dealerScore = document.createElement('div');
        game.dealerScore.textContent = "-";
        game.dealerScore.classList.add('score');
        game.dealer.append(game.dealerScore);
        game.dealer.append(game.dealerCards);

        // Player section
        game.player = document.createElement('div');
        game.playerCards = document.createElement('div');
        game.playerCards.textContent = "Player card";
        game.playerScore = document.createElement('div');
        game.playerScore.textContent = "-";
        game.playerScore.classList.add('score');
        game.player.append(game.playerScore);
        game.player.append(game.playerCards);

        // Append dealer and player to the table
        game.table.append(game.dealer);
        game.table.append(game.player);

        // Dashboard section
        game.dashboard = document.createElement('div');

        // Game status message
        game.status = document.createElement('div');
        game.status.classList.add('message');
        game.status.textContent = "Message for player";
        game.dashboard.append(game.status);

        // Deal button
        game.btnDeal = document.createElement('button');
        game.btnDeal.textContent = "Deal";
        game.btnDeal.classList.add('btn');
        game.dashboard.append(game.btnDeal);

        // Hit button
        game.btnHit = document.createElement('button');
        game.btnHit.textContent = "Hit";
        game.btnHit.classList.add('btn');
        game.dashboard.append(game.btnHit);

        // Stand button
        game.btnStand = document.createElement('button');
        game.btnStand.textContent = "Stand";
        game.btnStand.classList.add('btn');
        game.dashboard.append(game.btnStand);

        // Double Down button
        game.btnDoubleDown = document.createElement('button');
        game.btnDoubleDown.textContent = "Double Down";
        game.btnDoubleDown.classList.add('btn');
        game.dashboard.append(game.btnDoubleDown);


        // Player cash display
        game.playerCash = document.createElement('div');
        game.playerCash.classList.add('message');
        game.playerCash.textContent = "Player cash $100";
        game.dashboard.append(game.playerCash);

        // Bet input
        game.inputBet = document.createElement('input');
        game.inputBet.setAttribute('type', 'number');
        game.inputBet.style.width = "4em";
        game.inputBet.style.fontSize = "1.4em";
        game.inputBet.style.marginTop = "1em";
        game.inputBet.value = 0;
        game.dashboard.append(game.inputBet);

        // Bet button
        game.btnBet = document.createElement('button');
        game.btnBet.textContent = "Bet";
        game.btnBet.classList.add('btn');
        game.dashboard.append(game.btnBet);

        // Append dashboard to the table
        game.table.append(game.dashboard);
        game.main.append(game.table);

        
        
        
        // How to Play button
        game.btnHowToPlay = document.createElement('button');
        game.btnHowToPlay.textContent = "How to Play";
        game.btnHowToPlay.classList.add('btn');
        game.dashboard.append(game.btnHowToPlay);


        

        

    }


    return {
        init: init
    };
}();
