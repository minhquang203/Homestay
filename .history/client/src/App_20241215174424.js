import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import CategoryPage from "./pages/CategoryPage";
import CreateListing from "./pages/CreateListing";
import HomePage from "./pages/HomePage";
import ListingDetails from "./pages/ListingDetails";
import LoginPage from "./pages/LoginPage";
import PaymentPage from "./pages/PaymentPage";
import Profile from "./pages/Profile";
import PropertyList from "./pages/PropertyList";
import RegisterPage from "./pages/RegisterPage";
import ReservationList from "./pages/ReservationList";
import SearchPage from "./pages/SearchPage";
import TripList from "./pages/TripsList";
import AboutUs from "./pages/Useful Links/AboutUs";
import TermsAndConditions from "./pages/Useful Links/TermsAndConditions";
import WishList from "./pages/WishList";

function App() {
  return (
    <div>
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<HomePage/>}></Route>
         <Route path="/register" element={<RegisterPage/>}></Route>
         <Route path="/login" element={<LoginPage/>}></Route>
         <Route path="/profile" element={<Profile/>}></Route>
         <Route path="/create-listing" element={<CreateListing/>}></Route>
         <Route path="/properties/:listingId" element={<ListingDetails/>}></Route>
         <Route path="/properties/category/:category" element={<CategoryPage />} />
         <Route path="/properties/search/:search" element={<SearchPage />} />
         <Route path="/:userId/trips" element={<TripList />} />
         <Route path="/:userId/wishList" element={<WishList />} />
         <Route path="/:userId/properties" element={<PropertyList />} />
         <Route path="/:userId/reservations" element={<ReservationList />} />
         <Route path="/about-us" element={<AboutUs />} />
         <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
         <Route path="/payment" element={<PaymentPage />} /> 
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;