const Tour = require('./../models/tourModel');
const APIfeatures = require('./../utils/APIfeatures');

exports.aliasTopTour = (req, res, next) => {
  req.url =
    '/?limit=5&sort=-ratingsAverage,price&fields=ratingsAverage,price,name,difficulty,summary';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIfeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    //SEND RESPONSE
    const responseBody = {
      status: 'success',
      size: tours.length,
      data: {
        tours: tours,
      },
    };
    res.status(200).json(responseBody);
  } catch (err) {
    res.status(500).json({ status: 'error', error: err });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id).exec();
    const responseBody = {
      status: 'success',
      data: {
        tour: tour,
      },
    };
    res.status(200).json(responseBody);
  } catch (err) {
    res.status(404).json({
      status: 'error',
      error: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      message: 'Tour created',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).exec();
    res.status(200).json({
      status: 'success',
      data: {
        tour: updatedTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const deletedTour = await Tour.findByIdAndDelete(
      req.params.id,
      req.body,
    ).exec();
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err,
    });
  }
};
