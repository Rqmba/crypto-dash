import { useState, useEffect } from "react";
import HomePage from "./pages/home";
import AboutPage from "./pages/about";
import NotFoundPage from "./pages/not-found";
import CoinsDetailsPage from "./pages/coin-details";
import { Routes, Route } from "react-router";
import Header from "./components/Header";

// const API_URL =
//   "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

const BASE_URL = import.meta.env.VITE_API_BASE;
const PROXY = import.meta.env.VITE_API_PROXY;

const App = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(10);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("market_cap_desc");

  useEffect(() => {
    const API_URL = PROXY
      ? `${PROXY}${encodeURIComponent(
          BASE_URL +
            `&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
        )}`
      : `${BASE_URL}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`;

    const fetchCoins = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        console.log(data);
        setCoins(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, [limit]);

  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              coins={coins}
              filter={filter}
              setFilter={setFilter}
              limit={limit}
              setLimit={setLimit}
              sortBy={sortBy}
              setSortBy={setSortBy}
              loading={loading}
              error={error}
            />
          }
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/coin/:id" element={<CoinsDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
