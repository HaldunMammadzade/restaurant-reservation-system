import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure, logout } from '../store/slices/authSlice';
import { setCurrentRestaurant } from '../store/slices/restaurantSlice';
import { authService } from '../services/authService';
import { mockUser, mockRestaurant, DEMO_CREDENTIALS } from '../utils/mockData';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const demoLogin = () => {
    dispatch(loginStart());
    setTimeout(() => {
      dispatch(loginSuccess({ user: mockUser, token: 'demo-token-seatmind' }));
      dispatch(setCurrentRestaurant(mockRestaurant));
      toast.success('Demo rejiminə xoş gəldiniz!');
      navigate('/dashboard');
    }, 800);
  };

  const login = async (email, password) => {
    if (
      email === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password
    ) {
      dispatch(loginStart());
      setTimeout(() => {
        dispatch(loginSuccess({ user: mockUser, token: 'demo-token-seatmind' }));
        dispatch(setCurrentRestaurant(mockRestaurant));
        toast.success('Uğurla daxil oldunuz!');
        navigate('/dashboard');
      }, 600);
      return;
    }

    try {
      dispatch(loginStart());
      const data = await authService.login(email, password);
      dispatch(loginSuccess(data));
      dispatch(setCurrentRestaurant(mockRestaurant));
      toast.success('Uğurla daxil oldunuz!');
      navigate('/dashboard');
    } catch {
      dispatch(loginStart());
      setTimeout(() => {
        dispatch(loginSuccess({ user: mockUser, token: 'demo-token-seatmind' }));
        dispatch(setCurrentRestaurant(mockRestaurant));
        toast.success('Demo rejiminə daxil oldunuz!');
        navigate('/dashboard');
      }, 600);
    }
  };

  const register = async (userData) => {
    try {
      dispatch(loginStart());
      const data = await authService.register(userData);
      dispatch(loginSuccess(data));
      dispatch(setCurrentRestaurant(mockRestaurant));
      toast.success('Qeydiyyat uğurla tamamlandı!');
      navigate('/dashboard');
    } catch {
      dispatch(loginStart());
      setTimeout(() => {
        const newUser = { ...mockUser, name: userData.name, email: userData.email };
        dispatch(loginSuccess({ user: newUser, token: 'demo-token-seatmind' }));
        dispatch(setCurrentRestaurant({ ...mockRestaurant, name: userData.restaurantName || mockRestaurant.name }));
        toast.success('Demo hesab yaradıldı!');
        navigate('/dashboard');
      }, 800);
    }
  };

  const logoutUser = () => {
    dispatch(logout());
    toast.success('Çıxış edildi');
    navigate('/login');
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout: logoutUser,
    demoLogin,
  };
};
