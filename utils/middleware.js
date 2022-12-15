import jwt from 'jsonwebtoken';
import 'express-async-errors';
import * as logger from './logger.js';
import * as config from './config.js';

export const requestLogger = (req, res, next) => {
  logger.info('Method: ', req.method);
  logger.info('Path: ', req.path);
  logger.info('Body: ', req.body);
  logger.info('---');
  next();
};

export const extractToken = (req, res, next) => {
  const auth = req.get('authorization');
  if (auth && auth.toLowerCase().startsWith('bearer')) {
    const token = auth.substring(7);
    req.token = token;
  }

  next();
};

export const decodeToken = async (req, res, next) => {
  const { token } = req;
  if (!token) return res.status(401).send({
    message: 'No token provided, please login first to get a token'
  });

  jwt.verify(token, config.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        error: 'Invalid token',
      });
    }

    req.decoded = decoded;
    next();
  });
};

export const unknownEndpoint = (req, res) => {
  res.status(404).json({
    message: 'Resource Not Found (404)'
  });
};

export const errorHandler = (err, req, res, next) => {
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'invalid token',
    });
  } else if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expired',
    });
  }

  logger.error(err.message);

  next(err);
};