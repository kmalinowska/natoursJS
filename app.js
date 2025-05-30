
const fs = require('fs');
const express = require('express');
const res = require('express/lib/response');
const app = express()
const morgan = require('morgan');

// 1) MIDDLEWARES
app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
})

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
})

let tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, "utf-8")
);

//2) ROUT HANDLERS
function getAllTours(req, res) {
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

//3) ROUTES
app.route('/api/v1/tours')
  .get(getAllTours)
  .post(postAllTours);

app.route('/api/v1/tours/:id')
  .get(getOneTour)
  .patch(updateTour)
  .delete(deleteTour);

//4) START SERVER
const port = 3000;
app.listen(port, () => {console.log(`Listening on port ${port}`)});