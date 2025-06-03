const fs = require('fs');

let tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, "utf-8")
);

exports.loadTourByID = (req, res, next, id) => {
  const tour = tours.find(tour => tour.id === parseInt(id));
  if (tour === undefined)
    return res.status(404).json({status: 'not found'});
  else
    req.loadedTour = tour;
    next();
}

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  const responseBody = {
    status: 'success',
    message: 'Tours List',
    size: tours.length,
    requestTime: req.requestTime,
    data: {
      tours: tours
    }

  }
  res.status(200).json(responseBody);
}

exports.getOneTour = (req, res) => {
  console.log(req.params);

  const responseBody = {
    status: 'success',
    data: {
      tour: req.loadedTour
    }
  }
  res.status(200).json(responseBody);
}

exports.checkBody = (req, res, next) => {
  const {name, price} = req.body;
  if (!name || !price)
    return res.status(400).json({status: 'error', message: 'Bad request'});
  else
    next();
}

exports.postAllTours = (req, res) => {
  const newId = Math.floor(Math.random() * 10000) + 1;
  const newTour = Object.assign({}, req.body, {id: newId});
  tours.push(newTour);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), 'utf-8', err => {
    res.status(201).json({message: 'Tour created', tour: newTour})
  })
}

exports.updateTour = (req, res) => {
  const updatedTour = Object.assign(req.loadedTour, req.body);
  const tourIndex = tours.indexOf(req.loadedTour);
  tours[tourIndex] = updatedTour;

  res.status(200).json({
    status: 'success',
    data: {
      tour: updatedTour
    }
  })
};

exports.deleteTour = (req, res) => {
  tours = tours.filter(t => t.id !== req.loadedTour.id);

  res.status(204).json({
    status: 'success',
    data: null
  })

}