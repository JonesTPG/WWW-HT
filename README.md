[![Build Status](https://travis-ci.org/JonesTPG/WWW-HT.svg?branch=master)](https://travis-ci.org/JonesTPG/WWW-HT)

# WWW-harjoitustyö: Quiz-sovellus

MEVN-stackia käyttävä web-applikaatio, jossa voi tehdä quizeja sekä suorittaa niitä. Sovelluksessa on passport.js-kirjastoa käyttävä
autentikaatio, joten ilman kirjautumista sovellusta ei voi käyttää.

## Asennus

Repositoriossa on Dockerfile ja docker-compose.yml, joiden avulla sovelluksen voi asentaa Dockerilla. 

### Docker-asennus

Vaatimuksen docker ja docker-compose.

1. git clone https://github.com/JonesTPG/WWW-HT.git
2. docker-compose build
3. docker-compose up



## Yksikkötestit ja Continous Integration

Sovellus hyödyntää jest- ja supertest -testauskirjastoja, sekä Travis CI -testausautomaatiota.
Travis CI ajaa yksikkötestit läpi aina, kun repositorioon pushataan uusi versio sovelluksesta.





## Sovelluksessa käytetyt frameworkit sekä kirjastot

* [Express](https://expressjs.com/) - Web-framework
* [Nodejs](https:/nodejs.org/) - Javascript-suoritusympäristö/Serveri
* [Mongodb](https://mongodb.com/) - Dokumenttipohjainen tietokanta
* [Vue.js](https://vuejs.org/) - Front-End framework
* [Passport.js](http://passportjs.org/) - Autentikaatio-kirjasto


## Tekijä

* **Joonas Ryynänen** - *LUT-University* - [GitHub](https://github.com/JonesTPG)




