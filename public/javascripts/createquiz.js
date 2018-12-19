'use strict'

var selectedgenre;

//komponentti saa propsina yksittäisen genre-objektin
//pääkomponentin listasta

Vue.component('genreItem', {
    props: ['item'],
    

    methods: {
        updateSelected(name) {
            selectedgenre = name;
            console.log(selectedgenre)
            
        }
    },

//template yksittäiselle genrelle materialize-collectionissa

    template: `
    
        <li class="collection-item avatar blue-grey">

            <div class="row">

                <div class="col l3">
                    <img :src="item.imageUrl" alt="mathquiz" width="100px" height="100px"/>
                </div>
                <div class="col l9">
                    <span class="title white-text">{{item.name}}</span>
                    <p class="white-text">Kysymyksiä: {{item.questionAmount}} kpl <br>
                    </p> <br>
                    
                        <button v-on:click="updateSelected(item.name)" class="waves-effect blue darken-1 btn white-text">Valitse</button>
                   
                </div>
            </div>
            
        
        </li>
        
        `
  });



var app = new Vue({
    
    
    el: '#app',
    data: {
        
        genreList: [],
        newGenre: null,
        infoText: null   
    },

     created: function () {
        //haetaan genret ajaj:lla
        axios.get('http://localhost:3000/quiz/genres').then((response)=> {
            var data = JSON.parse(response.data);
            
            this.genreList = data;
        })
     },
  
  
    methods: {
       createGenre() {

            if (this.newGenre == null || this.newGenre == '') {
                this.infoText = 'Valitse genrelle nimi.';
                return;
            }

            //laitetaan uusi genre back-endille tallennettavaksi, ja ladataan sivu jotta
            //se tulee listaan näkyviin.

            var data = {genre: this.newGenre};
            axios.post('http://localhost:3000/create/new-genre', data).then((response)=> {
                window.location.reload(false); 
                return;
            })

           return;
       },

       proceed() {
        //genre on valittu, viedään käyttäjä kysymysten-teko sivulle ja laitetaan url-parametriksi
        //valittu genre

        if (selectedgenre == null) {
            this.infoText = 'Sinun täytyy valita genre ennen kuin voit valita kysymyksiä.';
            return;
        }

        this.infoText = '';

        window.location.href = "http://localhost:3000/create/questions?genre="+ selectedgenre

        return;
       }
    }
    
  });
  







