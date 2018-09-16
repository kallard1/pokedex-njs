const router = require('express').Router();
const Type = require('../models/Type');

router.get('/:type', (req, res) => {
  Type.findOne({name: req.params.type})
    .populate('pokemons')
    .then(type => {
      if (!type) {
        return res.status(404).send('Type not found');
      }
        res.render('types/index.ejs', {
          type: type,
          pokemons: type.pokemons
        });
    }, err => {
      console.log(err);
    });

});

module.exports = router;