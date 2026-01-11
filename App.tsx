import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { User } from './types';
import { auth, db, onAuthStateChanged, signOut, ref, onValue } from './services/firebase';

// Pages
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Bikes } from './pages/Bikes';
import { BookingFlow } from './pages/Booking';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/Admin';
import { BookingFormsList } from './pages/BookingFormsList';
import { BookingFormEditor } from './pages/BookingFormEditor';
import { PublicBookingForm } from './pages/PublicBookingForm';

const AuthenticatedApp = ({ user }: { user: User | null }) => {
   const location = useLocation();

   // If accessing a public booking form, show it without auth requirement
   if (location.pathname.startsWith('/book/')) {
      return (
         <Routes>
            <Route path="/book/:id" element={<PublicBookingForm />} />
         </Routes>
      );
   }

   if (!user) return <Login />;

   if (user.role === 'admin') {
      // Allow access to booking form editor routes even for admins
      if (location.pathname.startsWith('/booking-forms/')) {
         return (
            <Layout user={user}>
               <Routes>
                  <Route path="/booking-forms/new" element={<BookingFormEditor user={user} />} />
                  <Route path="/booking-forms/edit/:id" element={<BookingFormEditor user={user} />} />
                  <Route path="/booking-forms" element={<BookingFormsList user={user} />} />
               </Routes>
            </Layout>
         );
      }
      return <AdminDashboard onLogout={() => signOut(auth)} />;
   }

   return (
      <Layout user={user}>
         <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/bikes" element={<Bikes user={user} />} />
            <Route path="/booking" element={<BookingFlow user={user} />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/booking-forms" element={<BookingFormsList user={user} />} />
            <Route path="/booking-forms/new" element={<BookingFormEditor user={user} />} />
            <Route path="/booking-forms/edit/:id" element={<BookingFormEditor user={user} />} />
         </Routes>
      </Layout>
   );
};

const App = () => {
   const [user, setUser] = useState<User | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      return onAuthStateChanged(auth, async (u) => {
         if (u) {
            const userRef = ref(db, `users/${u.uid}`);
            onValue(userRef, (snapshot) => {
               if (snapshot.exists()) {
                  setUser(snapshot.val());
               } else {
                  // Security Check: Enforce DB record existence for access.
                  // Allow grace period for new sign-ups (DB creation latency).
                  const creationTime = u.metadata.creationTime ? new Date(u.metadata.creationTime).getTime() : 0;
                  const now = Date.now();
                  // If account is younger than 30 seconds, treat as signup-in-progress
                  if (now - creationTime < 30000) {
                     setUser({ id: u.uid, email: u.email!, firstName: 'Ny', lastName: 'Bruger', street: '', houseNumber: '', zipCode: '', city: '', role: 'user' });
                  } else {
                     // Account exists in Auth but deleted from DB -> Revoke Access
                     signOut(auth);
                     setUser(null);
                  }
               }
               setLoading(false);
            }, { onlyOnce: false });
         } else {
            setUser(null);
            setLoading(false);
         }
      });
   }, []);

   if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-10 h-10 border-4 border-brand-navy border-t-transparent rounded-full animate-spin"></div></div>;

   return (
      <HashRouter>
         <AuthenticatedApp user={user} />
      </HashRouter>
   );
};

export default App;