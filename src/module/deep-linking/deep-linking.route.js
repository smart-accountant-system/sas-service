import { Router } from 'express';
import constants from '../../config/constants';

const routes = new Router();

routes.get('/expo-publish/:token', (req, res) => {
  const token = req.params.token;
  return res.redirect(constants.PUBLISH_EXPO_LINK + token);
});

routes.get('/expo-debug/:token', (req, res) => {
  const token = req.params.token;
  return res.redirect(constants.DEBUG_EXPO_LINK + token);
});

routes.get('/release/:token', (req, res) => {
  const token = req.params.token;
  return res.redirect(constants.RELEASE_EXPO_LINK + token);
});

export default routes;
