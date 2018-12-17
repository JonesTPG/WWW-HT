'use strict'

var timer;

function timer() {


    timer = 1000;
    var interval = setInterval(function() {
        timer--;
        document.getElementById("timer").innerHTML = timer;
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
                
                this.questionList = data;

                var firstq = data[0];
                this.cur.question = firstq.question;
                this.cur.hint = firstq.hint;
                this.cur.imgUrl = firstq.imageUrl;
                
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


            
        }


         // saveAnswerAndPrevious() {

        //     if ( this.qNumber == 0 ) {
        //         return;
        //     }
        //     if (this.answer != null) {
               
        //         this.answerdata[this.qNumber] = {question: this.questionList[this.qNumber].question, answer: this.answer};
        //     }

            
        //     this.answer = null;
            
        //     this.qNumber--;
        //     var prevq = this.questionList[this.qNumber];
        //     this.cur.question = prevq.question;
        //     this.cur.hint = prevq.hint;
        //     this.cur.imgUrl = prevq.imageUrl;
        //     this.showHint = false;
        // },
    }
    
    
    
  });
  







