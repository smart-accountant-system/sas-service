import userRoutes from './user/user.route';

export default app => {
  app.use('/user', userRoutes);
};
