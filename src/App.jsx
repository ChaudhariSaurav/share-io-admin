import Login from "./components/Login";
import Dashboardpage from "./pages/Dashboardpage";
import AdminRoutes from "./routes/common";
import UserStore from "./store/userStore";

function App() {
  const { isLoggedIn } = UserStore(); // Get the login state
  console.log({ isLoggedIn });

  return (
    <AdminRoutes>{isLoggedIn ? <Dashboardpage /> : <Login />}</AdminRoutes>
  );
}

export default App;
