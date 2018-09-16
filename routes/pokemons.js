const router = require('express').Router();

const Pokemon = require('../models/Pokemon');
const Type = require('../models/Type');

router.get('/', (req, res) => {
  Pokemon.find({}).populate('types').then(pokemons => {
    res.render('pokemons/index.ejs', { pokemons: pokemons });
  });
});

router.get('/pokemon/new', (req, res) => {
  Type.find({}).then(types => {
    let pokemon = new Pokemon();
    res.render("pokemons/new.ejs", {
      pokemon: pokemon,
      types: types,
      endpoint: '/pokemon' });
  });
});

router.get('/pokemon/edit/:id', (req, res) => {
  Type.find({}).then(types => {
    Pokemon.findById(req.params.id).then(pokemon => {
      res.render("pokemons/edit.ejs", {
        pokemon: pokemon,
        types: types,
        endpoint: '/pokemon/' + pokemon._id.toString(),
      });
    }, err => res.status(404).send(err));
  });
});

router.get('/pokemon/:id', (req, res) => {
    Pokemon.findById(req.params.id).populate('types').then(pokemon => {
      res.render('pokemons/detail.ejs', { pokemon: pokemon });
    }, err => res.status(404).send(err));
});

router.get('/pokemon/delete/:id', (req, res) => {
  Pokemon.findOneAndRemove({
    _id: req.params.id
  }).then(() => {
    res.redirect('/');
  });
});

router.post('/pokemon/:id?', (req, res) => {
  new Promise((resolve, reject) => {
    if (req.params.id) {
      Pokemon.findById(req.params.id).then(resolve, reject);
    } else {
      resolve(new Pokemon());
    }
  }).then(pokemon => {
    pokemon.number = req.body.number;
    pokemon.name = req.body.name;
    pokemon.description = req.body.description;
    pokemon.types = req.body.types;

    if (req.file) {
      pokemon.picture = req.file.filename;
    }

    return pokemon.save();
  }).then(() => {
    res.redirect('/');
  }, err => {
    console.log(err);
  });
});

module.exports = router;
