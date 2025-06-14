import "@styles/App.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import AppFooter from "@components/AppFooter";
import AppMain from "@components/AppMain";
import AppNavbar from "@components/AppNavbar";

function App() {
  return (
    <>
      <AppNavbar />
      <AppMain />
      <AppFooter />
    </>
  );
}

export default App;
