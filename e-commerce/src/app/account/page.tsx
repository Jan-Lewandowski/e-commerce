'use client'

import CartDrawer from '@/components/CartDrawer/CartDrawer';
import FavoritesDrawer from '@/components/FavoritesDrawer/FavoritesDrawer';
import Header from '@/components/Header/Header';
import Button from '@/components/ui/Button/Button';
import '@/styles/profile.scss';
import { useApp } from '@/context/AppContext';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';

export default function ProfilePage() {
  const { updateUser, user, getOrderHistory } = useApp();
  const { showCartNoti } = useApp();
  const router = useRouter();
  const orderHistory = getOrderHistory();

  const isAdmin = user?.role === 'admin';
  const nickname = user?.username;

  const userOrders = orderHistory.filter((order) => order.email === user?.email);

  const goToDashboard = () => {
    router.push('/dashboard');
  }

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: SignupSchema,
    initialValues: {
      username: user?.username ?? '',
      email: user?.email ?? '',
    },
    onSubmit: ({ username, email }) => {
      if (!user) return;
      showCartNoti('Dane zostały zaktualizowane');
      updateUser(username, email);
    },
  });

  const usersOrderHistory = userOrders.map((order) => (
    <div key={order.orderId} className='order-card'>
      <div className='order-info'>
        <div><div>Adres dostawy:</div> {order.destination.name}, {order.destination.street}, {order.destination.city}, {order.destination.zipCode}</div>
        <div><div>Metoda płatności:</div> {order.paymentMethod}</div>
      </div>
      <div className='order-items'>
        <strong>Produkty:</strong>
        <ul>
          {order.items.map((item) => (
            <li key={item.productId}>{item.name} - Ilość: {item.quantity}</li>
          ))}
        </ul>
      </div>
    </div>
  ));

  return (
    <>
      <Header />
      <CartDrawer />
      <FavoritesDrawer />
      <div className='main-section'>
        <div className='title'>Dane konta</div>
        <form className='profile-form' onSubmit={formik.handleSubmit}>
          <label htmlFor='username'>Imię i nazwisko</label>
          <input
            id='username'
            className='form-input'
            {...formik.getFieldProps('username')}
          />
          {formik.touched.username && formik.errors.username && (
            <div className='error'>{formik.errors.username}</div>
          )}

          <label htmlFor='email'>Email</label>
          <input
            id='email'
            className='form-input'
            type='email'
            {...formik.getFieldProps('email')}
          />
          {formik.touched.email && formik.errors.email && (
            <div className='error'>{formik.errors.email}</div>
          )}

          <Button type='submit' className='dashboard-button'>Zapisz</Button>
        </form>

        {isAdmin && (
          <Button onClick={goToDashboard} className='dashboard-button'>Panel administratora</Button>
        )}

      </div>
      <div className='order-history-section'>
        <div className='title'>Historia zamówień</div>
        {usersOrderHistory.length === 0 ? (
          <div className='no-orders'>Brak zamówień</div>
        ) : (
          usersOrderHistory
        )}
      </div>
    </>
  );
}

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, "Imię i nazwisko musi mieć co najmniej 2 znaki")
    .max(50, "Imię i nazwisko może mieć maksymalnie 50 znaków")
    .matches(
      /^[a-zA-Z ]+$/,
      'Nazwa użytkownika może zawierać tylko litery'
    )
    .required("Podaj imię i nazwisko"),

  email: Yup.string()
    .email('Nieprawidłowy format email')
    .required('Email jest wymagany'),

});