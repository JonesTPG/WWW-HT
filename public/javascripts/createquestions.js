'use strict'

//Vue-komponentti, joka näyttää formin uuden kysymyksen tekemiseen.
//luodut kysymykset tallennetaan listapohjaisesti, ja sitten koko lista lähetetään lopuksi serverille.


var app = new Vue({
    
    
    el: '#app',
    data: {
        
        genre: null,
        questiondata: [],
        question: null,
        answer: null,
        amount: 0,
        infoText: null,
        hint: null,
        option1: null,
        option2: null
      
    },

     created: function () {
         //haetaan valittu genre url-parametrista
        var url = window.location.href;  
        
        var urlObj = new URL(url);
       
        this.genre = urlObj.searchParams.get("genre");
       
       
     },
  
  
    methods: {
        //metodi, joka tallentaa luodun kysymyksen listaan ja sitten tyhjentää formin.
        //se myös tarkistaa, että käyttäjä on täyttänyt joka kentän.
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

        if (this.option1 == null || this.option1 == '') {
            this.infoText = "Laita väärä vastaus 1."
            return;
        }

        if (this.option2 == null || this.option2 == '') {
            this.infoText = "Laita väärä vastaus 2."
            return;
        }

        this.infoText = 'Kysymys tallennettu. Syötä uusi kysymys. Jos olet valmis, paina "valmis".';
        //lisätään kysymyksen tiedot listaan.
        this.questiondata.push({question: this.question, answer: this.answer, hint: this.hint,
        option1: this.option1, option2: this.option2});
        
        this.amount = this.questiondata.length; // pidetään yllä kirjaa montako kysymystä on luotu
        //tyhjennetään formi seuraavaa kysymystä varten
        this.answer = '';
        this.question = '';
        this.hint = '';
        this.option1 = '';
        this.option2 = '';

        return;
       },

       //metodi, joka lähettää kysymyslistan serverille. samalla se laittaa serverille pyynnön päivittää
       //genren kysymysten määrä. Nämä hoidetaan kahdella erillisellä post-requestilla.
       submitQuestions() {

        if (this.questiondata.length == 0) {
            this.infoText = "Tee vähintään yksi kysymys.";
            return;
        }
        var data = {genre: this.genre, questions: this.questiondata};

        axios.post('http://localhost:3000/create/save-questions', data).then((response)=> {

                var data2 = {genre: this.genre, amount: this.amount};

                axios.post('http://localhost:3000/create/update-genre', data2).then((response)=> {

                    console.log('genre updated.');
                    window.location.href = "http://localhost:3000/profile";

                }).catch(function(error) {
                    console.log(error);
                });            
                    
                    
            }).catch(function(error) {
                console.log(error);
            });
        

        return;
       }

    }
    
  });
  







