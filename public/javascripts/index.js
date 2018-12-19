'use strict'

var app = new Vue({
    el: '#app',
    data: {
        errors: [],
        name: null,
        password: null,
        password2: null,
        loginfailed: false,  //jos passportilta on saatu url, jossa on parametrina login=failed, niin
        signupfailed: false  //ilmoitetaan kirjautumisen epäonnistumisesta Vuen avulla.
    },

     created: function () {
      
        const urlParams = new URLSearchParams(window.location.search); //haetaan mahdollinen url-parametri.
        const loginParam = urlParams.get('login');
        const signupParam = urlParams.get('signup');
       
        if (loginParam != null) {  //parametri saatu, ilmoitetaan käyttäjälle että kirjautuminen epäonnistui.
          
          this.loginfailed = true;
        }

        if (signupParam != null) {  //parametri saatu, ilmoitetaan käyttäjälle että rekisteröityminen epäonnistui.
          
          this.signupfailed = true;
        }
     },
  
  
    methods: {
      checkForm: function (e) {
        if (this.name  && this.password === this.password2 && this.password != null) {
          return true;  //form kelpaa lähetettäväksi.
        }
        
        this.errors = [];
  
        if (!this.name) {
          this.errors.push('Käyttäjänimi on pakollinen.');
        }

       

        if (this.password == null || this.password.length == 0)  {
          
          this.errors.push('Salasana on tyhjä.');
        }

        if (this.password !== this.password2) {
          this.errors.push('Salasanat eivät täsmää.')
        }

  
        e.preventDefault();
      },
      
      //apufunktio
      validEmail: function (email) { 
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
      }
    }
  })
  