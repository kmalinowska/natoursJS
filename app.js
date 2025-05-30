
const fs = require('fs');
const express = require('express');
const app = express()
app.use(express.json());

let tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, "utf-8")
);

function getAllTours(req, res) {
  const responseBody = {
    status: 'success',
    message: 'Tours List',
    size: tours.length,
    data: {
      tours: tours
    }

  }
  res.status(200).json(responseBody);
}

function getOneTour(req, res) {
  console.log(req.params);

  const tour = tours.find(tour => tour.id === parseInt(req.params.id));

  if (tour === undefined)
    return res.status(404).json({status: 'not found'})

  const responseBody = {
    status: 'success',
    data: {
      tour
    }
  }
  res.status(200).json(responseBody);
}

const postAllTours = (req, res) => {
  const newId = Math.floor(Math.random() * 10000) + 1;
  const newTour = Object.assign({}, req.body, {id: newId});
  tours.push(newTour);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), 'utf-8', err => {
    res.status(201).json({message: 'Tour created', tour: newTour})
  })
}

const updateTour = (req, res) => {
  const tour = tours.find(tour => tour.id === parseInt(req.params.id));
  if (tour === undefined) return res.status(404).json({ status: 'not found' });

  const updatedTour = Object.assign(tour, req.body);
  const tourIndex = tours.indexOf(tour);
  tours[tourIndex] = updatedTour;

  res.status(200).json({
    status: 'success',
    data: {
      tour: updatedTour
    }
  })
};

const deleteTour = (req, res) => {
  const tour = tours.find(tour => tour.id === parseInt(req.params.id));
  if (tour === undefined) return res.status(404).json({status: 'not found'});

  tours = tours.filter(t => t.id !== tour.id);

  res.status(204).json({
    status: 'success',
    data: null
  })

}

app.route('api/v1/tours')
  .get(getAllTours)
  .post(postAllTours);

app.route('api/v1/tours/:id')
  .get(getOneTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {console.log(`Listening on port ${port}`)});