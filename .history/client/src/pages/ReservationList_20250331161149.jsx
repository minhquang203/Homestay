import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setReservationList } from "../Redux/state";
import Footer from "../components/Footer";
import ListingCard from "../components/ListingCard";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import "../styles/List.scss";
