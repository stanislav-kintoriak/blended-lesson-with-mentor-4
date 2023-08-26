const carModel = require('../models/carModel');
const asyncHandler = require('express-async-handler');

class CarsController {
    add = asyncHandler(async (req, res)=> {
        const {title, price} = req.body;
        if (!title || !price) {
            res.status(400)
            throw new Error('provide all required fields')
        }
        const car = await carModel.create({...req.body});
        res.status(201).json({
          code: 201,
          data: car,
          message: "Sucsess"
        })
      });

    getAll = asyncHandler(async (req, res)=> {
        const cars = await carModel.find({});
        res.status(201).json({
          code: 201,
          data: cars,
          message: "Sucsess",
          qty: cars.length
        })
    });

    getOne = (req, res)=> {
        res.send("getOne")
    };

    updateCar = (req, res)=> {
        res.send("updateCar")
    };

    removeCar = (req, res)=> {
        res.send("removeCar")
    };
};

module.exports = new CarsController();