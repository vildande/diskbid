import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Layout } from "./components/Layout";
import { AuthProvider } from "./hoc/AuthProvider";
import { RequireAuth } from "./hoc/RequireAuth";
import BidsPage from "./pages/CurrentBidsPage";
import { FeedbackPage } from "./pages/FeedbackPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { LogoutPage } from "./pages/LogoutPage";
import { NotfoundPage } from "./pages/NotfoundPage";
import { ProductBidPage } from "./pages/ProductBidPage";
import { RegisterPage } from "./pages/RegisterPage";
import AddProductBidPage from "./pages/AddProductBidPage";
import DeleteProductBidPage from "./pages/DeleteProductBidPage";
import ClosedBidsPage from "./pages/ClosedBidsPage";
import { ClosedBidPage } from "./pages/ClosedBidPage";
import { ProductBidPendingPage } from "./pages/ProductBidPendingPage";
import { BidsForClosedProductPage } from "./pages/BidsForClosedProductPage";
import { FeedbacksPage } from "./pages/FeedbacksPage";
import { AcceptPendingBidsPage } from "./pages/AcceptPendingBidsPage";
import { ProductBidPendingAdminPage } from "./pages/ProductBidPendingAdminPage";
import { BidResultsPage } from "./pages/BidResultsPage";
import { ChooseWinnerPage } from "./pages/ChooseWinnerPage";
import { ChooseWinnerBidsPage } from "./pages/ChooseWinnerBidsPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route element={<RequireAuth allowedRoles={["ROLE_USER"]} />}>
            <Route index element={<HomePage />} />
            <Route path="bids/:id" element={<ProductBidPage />} />
            <Route path="bids/:id/all" element={<BidsPage />} />
            <Route path="bids/add" element={<AddProductBidPage />} />
            <Route path="bids/closed" element={<ClosedBidsPage />} />
            <Route path="bids/closed/:id" element={<ClosedBidPage />} />
            <Route
              path="bids/closed/:id/all"
              element={<BidsForClosedProductPage />}
            />
            <Route path="bids/delete" element={<DeleteProductBidPage />} />
            <Route path="bids/delete/:id" element={<ProductBidPendingPage />} />
            <Route path="feedback" element={<FeedbackPage />} />
          </Route>

          <Route
            path="admin"
            element={<RequireAuth allowedRoles={["ROLE_ADMIN"]} />}
          >
            <Route path="feedbacks" element={<FeedbacksPage />} />
            <Route path="bids" element={<AcceptPendingBidsPage />} />
            <Route path="bids/result" element={<BidResultsPage />} />
            <Route path="bids/result/:id" element={<ChooseWinnerPage />} />
            <Route
              path="bids/result/:id/all"
              element={<ChooseWinnerBidsPage />}
            />
            <Route path="bids/:id" element={<ProductBidPendingAdminPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/logout" element={<LogoutPage />} />

          <Route path="*" element={<NotfoundPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
