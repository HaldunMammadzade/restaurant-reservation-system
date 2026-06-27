import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure, logout } from '../store/slices/authSlice';
import { setCurrentRestaurant } from '../store/slices/restaurantSlice';
import { DEMO_CREDENTIALS, mockUser, mockRestaurant } from '../utils/mockData';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const handleAuthSuccess = (data) => {
    localStorage.setItem('token', data.token);
    dispatch(loginSuccess({ user: data.user, token: data.token }));
    dispatch(setCurrentRestaurant(data.user.restaurant || mockRestaurant));
    toast.success('Uğurla daxil oldunuz!');
    navigate('/dashboard');
  };

  const login = async (email, password) => {
    dispatch(loginStart());
    await new Promise((r) => setTimeout(r, 400));

    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      handleAuthSuccess({
        token: 'seatmind-demo-token',
        user: { ...mockUser, restaurant: mockRestaurant },
      });
      return;
    }

    const message = 'Email və ya şifrə yanlışdır (demo: demo@seatmind.az / demo123)';
    dispatch(loginFailure(message));
    toast.error(message);
  };

  const register = async (userData) => {
    dispatch(loginStart());
    await new Promise((r) => setTimeout(r, 600));

    const newUser = {
      ...mockUser,
      name: userData.name,
      email: userData.email,
      restaurant: { ...mockRestaurant, name: userData.restaurantName },
    };
    handleAuthSuccess({ token: 'seatmind-demo-token', user: newUser });
    toast.success('Qeydiyyat uğurla tamamlandı!');
  };

  const demoLogin = () => login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);

  const logoutUser = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    toast.success('Çıxış edildi');
    navigate('/login');
  };

  return { user, isAuthenticated, loading, error, login, register, logout: logoutUser, demoLogin };
};
