import { Outlet } from 'react-router-dom';
import Header from './Header';

function Layout() {
  return (
    <div className="app-layout">
      <Header />

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;