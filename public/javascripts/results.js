'use strict'




document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems, {});
  });

Vue.component('resultItem', {
    props: ['item'],
    

    methods: {
       
    },

    template: `
    
    <li>
        <div class="collapsible-header blue-grey white-text">
        <i class="material-icons">arrow_downward</i>
            Kysymys numero {{item.id+1}}: {{item.question}} 
        
        </div>
            
        <div class="collapsible-body white-text">

            <span>Vastasit: {{item.userAnswer}}</span>
                <p>Oikea vastaus: {{item.rightAnswer}} <br>
                </p> <br>
        
        </div>
    

    </li>
        `
  });





var app = new Vue({
    
    
    el: '#app',
    data: {
        id: '',
        data: [],
        rightAnswers: [],
        userAnswers: [],
        questions: [],
        booleanAnswers: [],
        score: 0,
        genre: '',
        amount: 0,
        right: 0    
    },

     created: function () {

        var url = window.location.href;  
        
        var urlObj = new URL(url);
        this.id = urlObj.searchParams.get("id");
        var data = {id: this.id};
        axios.post('http://localhost:3000/quiz/get-results', data).then((response)=> {
                    
            var data = JSON.parse(response.data);
            

            this.rightAnswers = data.rightAnswers;
            this.userAnswers = data.answers;
            this.questions = data.questions;
            this.booleanAnswers = data.booleanAnswers;

           
            console.log(this.data)
            
            this.score = data.score;
            this.genre = data.genre;
            this.amount = data.amount;
            this.right = data.right;
           
            for (var i=0; i<this.amount; i++) {
                this.data[i] = {
                    userAnswer: this.userAnswers[i],
                    rightAnswer: this.rightAnswers[i],
                    question: this.questions[i],
                    booleanAnswer: this.booleanAnswers[i],
                    id: i

                }
            }


                    
            }).catch(function(error) {
                console.log(error);
            });
     
     },
  
  
    methods: {
        
        retry() {

            window.location.href = "http://localhost:3000/quiz/newquiz?genre="+this.genre+"&amount="+this.amount;

        }

    }
    
    
    
  });
  







