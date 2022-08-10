import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductBidClosed from "../components/ProductBidClosed";
import { useAuth } from "../hooks/useAuth";
import BidService from "../service/BidService";

function ClosedBidsPage() {
  const navigate = useNavigate();
  const { user, signout } = useAuth();
  const [productBids, setProductBids] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await BidService.getClosedBids(user.token);
        setProductBids(response.data);
      } catch (error) {
        console.error(error);
        if (error.response?.status === 401)
          signout(() => navigate("/login", { replace: true }));
      }
    }
    setLoading(true);
    fetchData();
    setLoading(false);
  }, []);

  return (
    <div>
      <div className="my-3 pb-4 max-w-7xl mx-auto flex shadow border-b">
        <div className="px-8 py-8 flex justify-between space-x-10 w-full">
          <div className=" w-20 text-center mt-3">
            <Link to="/" className="text-blue-600">
              Go Home
            </Link>
          </div>
          <div className="container mx-auto">
            <div className="mb-4">
              <p className="mt-3 font-thin text-2xl tracking-wider">
                Closed bids:
              </p>
            </div>
            {productBids.length <= 0 && !loading ? (
              <div className="min-w-full">No Pending bids</div>
            ) : (
              <div className="flex shadow border-b">
                <table className="min-w-full">
                  <thead className="bg-bray-50">
                    <tr className="text-left text-gray-600 font-medium uppercase tracking-wider">
                      <th className="py-3 px-6">Image</th>
                      <th className="py-3 px-6">Name</th>
                      <th className="py-3 px-6">Owner</th>
                      <th className="py-3 px-6">End Time</th>
                      <th className="py-3 px-6">Winner</th>
                    </tr>
                  </thead>
                  {!loading && (
                    <tbody className="bg-white ">
                      {productBids.map((productBid) => (
                        <ProductBidClosed
                          key={productBid.id}
                          productBid={productBid}
                        />
                      ))}
                    </tbody>
                  )}
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center"></div>
    </div>
  );
}

export default ClosedBidsPage;
