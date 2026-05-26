'use client'

import Header from '@/components/Header';
import Button from '@/components/ui/Button/Button';
import { useAuth } from '@/context/AuthContext';
import { useMyOrders } from '@/lib/queries/orders';
import { useRouter } from 'next/navigation';

function profileValue(value?: string | null) {
  return value || "Brak danych";
}

export default function ProfilePage() {
  const { user: authUser, isLoggedIn } = useAuth();
  const router = useRouter();
  const ordersQuery = useMyOrders(isLoggedIn);

  const isAdmin = authUser?.role === 'admin';
  const userOrders = ordersQuery.data ?? [];

  const goToDashboard = () => {
    router.push('/dashboard');
  }

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-600">Konto</p>
              <h1 className="mt-1 text-3xl font-black text-slate-950">Dane konta</h1>
            </div>
            {isAdmin && (
              <Button onClick={goToDashboard}>Panel administratora</Button>
            )}
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Email</div>
            <div className="mt-1 break-all font-semibold text-slate-950">{authUser?.email}</div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <ProfileField label="Imię i nazwisko" value={authUser?.name} />
            <ProfileField label="Telefon" value={authUser?.phone} />
            <ProfileField label="Ulica" value={authUser?.street} />
            <ProfileField label="Miasto" value={authUser?.city} />
            <ProfileField label="Kod pocztowy" value={authUser?.zipCode} />
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-black text-slate-950">Historia zamówień</h2>
          {ordersQuery.isLoading ? (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">Ładowanie zamówień...</div>
          ) : ordersQuery.isError ? (
            <div className="mt-4 rounded-2xl border border-dashed border-red-300 bg-white p-8 text-center text-sm text-red-600">Nie udało się załadować zamówień.</div>
          ) : userOrders.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">Brak zamówień</div>
          ) : (
            <div className="mt-4 grid gap-4">
              {userOrders.map((order) => (
                <article key={order.orderId} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="grid gap-3 border-b border-slate-100 pb-4 text-sm text-slate-600 sm:grid-cols-2">
                    <div>
                      <div className="font-bold text-slate-950">Adres dostawy</div>
                      <div>{order.destination.name}, {order.destination.street}, {order.destination.city}, {order.destination.zipCode}</div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-950">Metoda płatności</div>
                      <div>{order.paymentMethod}</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="font-bold text-slate-950">Produkty</div>
                    <ul className="mt-2 grid gap-2">
                      {order.items.map((item) => (
                        <li key={item.productId} className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">{item.name} - Ilość: {item.quantity}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

function ProfileField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{label}</div>
      <div className="mt-1 break-words font-semibold text-slate-950">{profileValue(value)}</div>
    </div>
  );
}
