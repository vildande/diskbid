import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductBid from "../components/ProductBid";
import { useAuth } from "../hooks/useAuth";
import BidService from "../service/BidService";

const HomePage = () => {
  const navigate = useNavigate();
  const [productBids, setProductBids] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, signout } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await BidService.getActiveBids(user.token);
        setProductBids(response.data);
      } catch (error) {
        console.error(error);
        if (error.response.status === 401)
          signout(() => navigate("/", { replace: true }));
      }
    }
    setLoading(true);
    fetchData();
    setLoading(false);
  }, []);

  return (
    <div>
      <div className="my-3 pb-4 max-w-7xl mx-auto flex shadow border-b">
        <div className="px-8 py-8 flex justify-between space-x-6 w-full">
          <div className="flex flex-col space-y-2">
            {user.roles?.includes("ROLE_ADMIN") ? (
              <>
                <Link
                  to="/admin/bids/"
                  className="mt-10 text-blue-600 underline"
                >
                  Accept pending bids
                </Link>
                <Link
                  to="/admin/bids/result"
                  className="mt-10 text-blue-600 underline"
                >
                  Choose bid winner
                </Link>
                <Link
                  to="/bids/closed"
                  className="mt-10 text-blue-600 underline"
                >
                  Check closed bids
                </Link>
                <Link
                  to="/admin/feedbacks"
                  className="mt-10 text-blue-600 underline"
                >
                  Check Feedbacks
                </Link>
              </>
            ) : (
              <>
                <Link to="/bids/add" className="mt-10 text-blue-600 underline">
                  Add product to bidding
                </Link>
                <Link to="/bids/delete" className="text-blue-600 underline">
                  Remove product from bidding
                </Link>

                <Link
                  to="/bids/closed"
                  className="mt-10 text-blue-600 underline"
                >
                  Check closed bids
                </Link>
                <Link to="/feedback" className="mt-10 text-blue-600 underline">
                  Send Feedback
                </Link>
              </>
            )}
          </div>
          <div className="container mx-auto">
            <div className="mb-4">
              <p className="text-lg font-thin">Welcome, {user.username}!</p>
              <p className="mt-3 font-thin tracking-wider">
                Current active bids:
              </p>
            </div>
            {productBids.length > 0 ? (
              <div className="flex shadow border-b">
                <table className="min-w-full">
                  <thead className="bg-bray-50">
                    <tr className="text-left text-gray-600 font-medium uppercase tracking-wider">
                      <th className="py-3 px-6">Image</th>
                      <th className="py-3 px-6">Name</th>
                      <th className="py-3 px-6">Owner</th>
                      <th className="py-3 px-6">Minimum Bid</th>
                      <th className="py-3 px-6">Bid Enddate</th>
                    </tr>
                  </thead>
                  {!loading && (
                    <tbody className="bg-white ">
                      {productBids.map((productBid) => (
                        <ProductBid
                          key={productBid.id}
                          productBid={productBid}
                        />
                      ))}
                    </tbody>
                  )}
                </table>
              </div>
            ) : (
              !loading && <p>No bids.</p>
            )}
          </div>
        </div>
      </div>

      {/* <p className="mt-12 text-gray-400 px-2">
        [CURRENT USER]
        <br />
        Username: {user ? user.username : "Unknown"}
        <br />
        Token: {user ? user.token : "Unknown"}
      </p> */}
    </div>
  );
};

export { HomePage };
