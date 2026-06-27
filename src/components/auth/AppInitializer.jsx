import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/slices/authSlice';
import { setCurrentRestaurant } from '../../store/slices/restaurantSlice';
import { mockUser, mockRestaurant } from '../../utils/mockData';

const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(loginSuccess({ user: { ...mockUser, restaurant: mockRestaurant }, token }));
      dispatch(setCurrentRestaurant(mockRestaurant));
    }
  }, [dispatch]);

  return children;
};

export default AppInitializer;
