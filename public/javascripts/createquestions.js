'use strict'


var app = new Vue({
    
    
    el: '#app',
    data: {
        
        genre: null,
        questiondata: [],
        question: null,
        answer: null,
        amount: 0,
        infoText: null,
        hint: null
      
    },

     created: function () {
        var url = window.location.href;  
        console.log(url);
        var urlObj = new URL(url);
       
        this.genre = urlObj.searchParams.get("genre");
        console.log(this.genre)
       
     },
  
  
    methods: {
       saveAndNext() {

        if (this.question == null || this.question == '') {
            this.infoText = "Laita kysymys."
            return;
        }
        if (this.answer == null || this.answer == '') {
            this.infoText = "Laita vastaus."
            return;
        }
        if (this.hint == null || this.hint == '') {
            this.infoText = "Laita vihje."
            return;
        }

        this.infoText = 'Kysymys tallennettu. Syötä uusi kysymys. Jos olet valmis, paina "valmis".';

        this.questiondata.push({question: this.question, answer: this.answer, hint: this.hint});
        this.answer = '';
        this.question = '';
        this.hint = '';

        return;
       },

       submitQuestions() {

        if (this.questiondata.length == 0) {
            this.infoText = "Tee vähintään yksi kysymys.";
            return;
        }
        var data = {genre: this.genre, questions: this.questiondata};

        axios.post('http://localhost:3000/create/save-questions', data).then((response)=> {
                    
                    
                   console.log("success");
                   window.location.href = "http://localhost:3000/profile";
                   return;
                    
                    
            }).catch(function(error) {
                console.log(error);
            });
        

        return;
       }

    }
    
  });
  







