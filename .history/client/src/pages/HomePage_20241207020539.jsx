import Categories from "../components/Categories";
import Footer from "../components/Footer";
import Listings from "../components/Listings";
import Navbar from '../components/Navbar';
import Slide from "../components/Slide";



const HomePage = () => {

  // Lấy thông tin người dùng từ Redux state
  return <div>
    <Navbar/>
    <Slide/>
    <Categories/>
    <Listings/>
    <Footer />
  </div>;
};

export default HomePage;
