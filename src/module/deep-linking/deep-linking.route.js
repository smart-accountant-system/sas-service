import { Router } from 'express';
import constants from '../../config/constants';

const routes = new Router();

routes.get('/:token', (req, res) => {
  const token = req.params.token;
  console.log(constants.PUBLISH_EXPO_LINK + token);
  
  return res.redirect(constants.PUBLISH_EXPO_LINK + token);
});

export default routes;
