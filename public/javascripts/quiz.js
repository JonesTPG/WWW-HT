'use strict'

var timer;

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
        cur: {
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
       
        this.genre = urlObj.searchParams.get("genre");
        this.amount = urlObj.searchParams.get("amount");
        //this.user = urlObj.searchParams.get("user");

        var data = {
            genre: this.genre,
            amount: this.amount,
        }

        axios.post('http://localhost:3000/quiz/get-questions', data).then((response)=> {
                var data = JSON.parse(response.data);
                console.log(data)
                if (data == true) {
                    console.log("redirect")
                    window.location.href = 'http://localhost:3000/quiz/start?error=true';
                    return;
                }
                this.questionList = data;

                var firstq = data[0];
                this.cur.question = firstq.question;
                this.cur.options[0] = firstq.option3;
                this.cur.options[1] = firstq.option1;
                this.cur.options[2] = firstq.option2;

                this.cur.options = this.shuffle(this.cur.options);


                this.cur.hint = firstq.hint;
                this.cur.imgUrl = firstq.imageUrl;

                console.log(firstq)
                
        });

        
        
        
     
     },
  
  
    methods: {
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


            var data = {
                answerdata: this.answerdata,
                amount: this.amount,
                genre: this.genre
            }
    
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
  







