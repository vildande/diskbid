import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import BidService from "../service/BidService";

export const BidsForClosedProductPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [bids, setBids] = useState([]);

  useEffect(() => {
    BidService.getBidsOfClosedProduct(user.token, id)
      .then((response) => {
        setBids(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  return (
    <div className="my-3 flex max-w-4xl mx-auto shadow border-b">
      <div className="px-8 py-8 w-full">
        {bids.length !== 0 ? (
          <>
            <div className="font-thin text-2xl text-center tracking wider mb-2">
              Bids for {bids[0].productName}
            </div>
            <div className="block  mb-5">
              <div className="text-blue-600">
                <Link to={"/"}>Go Home</Link>
              </div>
              <div className="text-blue-600">
                <Link to={"./.."}>Go to Product Page</Link>
              </div>
            </div>
            <table className="w-full border">
              <thead className="bg-bray-50">
                <tr className="text-left text-gray-600 font-medium uppercase tracking-wider">
                  <th className="py-3 px-6">Bid by</th>
                  <th className="py-3 px-6">Bid Amount</th>
                  <th className="py-3 px-6">Bid Time</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {bids.map((b) => (
                  <tr key={b.id} className="text-left text-gray-700">
                    <td className=" text-lg px-6 py-4 whitespace-nowrap">
                      {b.bidder}
                    </td>
                    <td className="text-lg px-6 py-4 whitespace-nowrap">
                      {b.amount}
                    </td>
                    <td className="text-lg px-6 py-4 whitespace-nowrap">
                      {new Date(b.time).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <div className="font-thin text-2xl tracking wider">No bids.</div>
            <div className="block mb-5">
              <div className="text-blue-600">
                <Link to={"/"}>Go Home</Link>
              </div>
              <div className="text-blue-600">
                <Link to={"./.."}>Go to Product Page</Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
