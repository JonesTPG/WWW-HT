'use strict'

//quiz-sivun Vue-komponentti, käyttäjän vastaukset talletetaan listaan ja lähetetään lopulta serverille
//tarkistettavaksi. Tämän jälkeen käyttäjä ohjataan tulossivulle.



var timer; //globaali pistemuuttuja, näkyy myös Vue-komponentille.
// funktio, joka näyttää käyttäjälle laskurin mikä kuvaa quizin pistemäärää.
function timer() {
    timer = 1000;
    var interval = setInterval(function() {
        timer--;
        document.getElementById("timer").innerHTML = "Pisteet: " +timer;
        if (timer == 0) {
            timer = 1;
        }
    }, 10);

    
}


//palauttaa laskurin arvon. Funktiota kutsutaan siloin kun käyttäjä ilmoittaa olevansa
//valmis siirtymään eteenpäin.
function getTime() {
    return timer;
}

var app = new Vue({
    
    
    el: '#app',
    data: {
        questionList: null,
        genre: null,
        amount: null,
        user: null,
        cur: { //sisältää senhetkisen kysymyksen tiedot
            question: null,
            options: [],
            hint: null,
            imgUrl: null
        },
        qNumber: 0,
        answer: null,
        timer: 0,
        showHint: false,
        ready: false,
        infoText: '',
        answerdata: [{}],
        score: 0
    },

     created: function () {

        timer();
        var url = window.location.href;  
        console.log(url);
        var urlObj = new URL(url);
       
        //huom! koska käytössä on url-parametrit, quiz-linkin avulla voidaan aloittaa uusi quiz
        //kirjoittamalla oikea url. (mahdollistaa esim. tietyn quizin jakamisen)
        this.genre = urlObj.searchParams.get("genre"); //url-parametri
        this.amount = urlObj.searchParams.get("amount"); // url-parametri
        
        var data = {
            genre: this.genre,
            amount: this.amount,
        }

        //lähetetään parametrien perusteella pyyntö serverille.
        //vastauksena saadaan randomisoidut kysymykset
        axios.post('http://localhost:3000/quiz/get-questions', data).then((response)=> {
                var data = JSON.parse(response.data);
              
                //jos vastauksena saatiin {error: true}, niin redirectataan käyttäjä
                //valitsemaan asetukset uudestaan
                if (data == true) {
                   window.location.href = 'http://localhost:3000/quiz/start?error=true';
                    return;
                }
                //muuten valmistellaan ensimmäinen kysymys
                this.questionList = data;

                var firstq = data[0];
                this.cur.question = firstq.question;
                this.cur.options[0] = firstq.option3;
                this.cur.options[1] = firstq.option1;
                this.cur.options[2] = firstq.option2;

                //sekoitetaan vaihtoehdot, sama funktio kuin serverilläkin.
                this.cur.options = this.shuffle(this.cur.options);


                this.cur.hint = firstq.hint;
                this.cur.imgUrl = firstq.imageUrl;

               
                
        });

        
        
        
     
     },
  
  
    methods: {
        //metodi, joka tallentaa senhetkisen vastauksen, sekä metadatan "answerdata"-listaan.
        //sen jälkeen käyttäjälle näytetään seuraava kysymys.
        saveAnswerAndNext() {

            if (this.answer==null) {
                this.infoText = "Vastaa kysymykseen.";
                return;

            }
            this.infoText = '';

            this.score = getTime();
            
            if (this.qNumber == this.amount-2) {
                document.getElementById("next").style = "display: none;";
                
                this.ready = true;
                
            }

            //tarkistukset tehty, tallennetaan vastaus listaan ja näytetään
            //käyttäjälle seuraava kysymys.

            this.answerdata[this.qNumber] = {question: this.questionList[this.qNumber].question, answer: this.answer, score: this.score};
            
            this.qNumber++;
            this.answer = null;
            var nextq = this.questionList[this.qNumber];
            this.cur.question = nextq.question;

            this.cur.options[0] = nextq.option3;
            this.cur.options[1] = nextq.option1;
            this.cur.options[2] = nextq.option2;

            this.cur.options = this.shuffle(this.cur.options);

            this.cur.hint = nextq.hint;
            this.cur.imgUrl = nextq.imageUrl;
            this.showHint = false;
            this.score = 0;
            timer = 1000;
            
            
        },

        //vihjeen painaminen vähentää 200 pistettä.

        showhint() {
            if (this.showHint == false) {
                this.showHint = true;
                if (timer > 200) {
                    timer = timer-200;
                } 
                
            }
            else {
                this.showHint = false;
            }
        },


        //metodi, joka muodostaa answerdata-listasta sekä muusta datasta objektin
        submitQuiz() {

            if (this.answer == null) {
                this.infoText = 'Vastaa kysymykseen.';
                return;
            }
            this.score = getTime();
            this.answerdata[this.qNumber] = {question: this.questionList[this.qNumber].question, answer: this.answer, score: this.score};
        
            for (var i=0; i<this.amount; i++) {
                if (this.answerdata[i] == null) {
                    this.infoText = "Vastaa vielä kysymykseen numero "+(i+1);
                    return;
                }
                
            }

            
            this.infoText = "";

            //pakataan data post-requestia varten
            var data = {
                answerdata: this.answerdata,
                amount: this.amount,
                genre: this.genre
            }
            // lähetetään tiedot serverille. Serveri palauttaa tallennetun result-dokumentin id:n. Ohjataan
            // käyttäjä tulossivulle, ja laitetaan resultin id url-parametriksi.
            axios.post('http://localhost:3000/quiz/save-results', data).then((response)=> {
                    
                    var data = JSON.parse(response.data);
                    console.log(data);

                    window.location.href = "http://localhost:3000/quiz/results?id="+ data;
                    
                    
            }).catch(function(error) {
                console.log(error);
            });


            
        },

        shuffle(array) { //Knuth-shuffle, sekoittaa vastausvaihtoehdot.
            //lähde: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
            var currentIndex = array.length, temporaryValue, randomIndex;
          
            
            while (0 !== currentIndex) {
          
              
              randomIndex = Math.floor(Math.random() * currentIndex);
              currentIndex -= 1;
          
             
              temporaryValue = array[currentIndex];
              array[currentIndex] = array[randomIndex];
              array[randomIndex] = temporaryValue;
            }
          
            return array;
          }


        
    }
    
    
    
  });
  







