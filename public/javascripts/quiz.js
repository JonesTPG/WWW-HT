'use strict'
'use strict'

var app = new Vue({
    
    
    el: '#app',
    data: {
        
        
        questionList: null,
        genre: null,
        amount: null,
        user: null
    
    },

     created: function () {
        var url = window.location.href;  
        console.log(url);
        var urlObj = new URL(url);
       
        this.genre = urlObj.searchParams.get("genre");
        this.amount = urlObj.searchParams.get("amount");
        this.user = urlObj.searchParams.get("user");
        
        
     
     },
  
  
    methods: {
        startQuiz() {
            console.log(selectedgenre);
            
        }
    }
    
  });
  







