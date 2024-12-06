import Navbar from '../components/Navbar';
import Slide from "../components/Slide"
import Categories from "../components/Categories"
import Listings from "../components/Listings"



const HomePage = () => {

  // Lấy thông tin người dùng từ Redux state
  return <div>
    <Navbar/>
    <Slide/>
    <Categories/>
    <Listings/>
  </div>;
};

export default HomePage;
