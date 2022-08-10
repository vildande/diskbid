import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import BidService from "../service/BidService";

export const ChooseWinnerBidsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);

  const [uniqueBids, setUniqueBids] = useState([]);
  const [winner, setWinner] = useState("-1");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    BidService.getBidsOfNotChosenClosedBids(user.token, id)
      .then((response) => {
        setBids(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  useEffect(() => {
    setUniqueBids([
      ...new Map(bids.map((item) => [item["bidderId"], item])).values(),
    ]);
  }, [bids]);

  function handleChange(event) {
    const { value } = event.target;
    setWinner(value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    BidService.selectWinner(user.token, id, winner)
      .then((response) => {
        console.log(response.data?.message);
        navigate("./../..");
      })
      .catch((error) => {
        setFormError(error.response?.data?.message);
        console.error(error);
      });
  }

  return (
    <div className="my-3 flex max-w-4xl mx-auto shadow border-b">
      <div className="px-8 py-8 w-full">
        <div className="block mb-5">
          <div className="text-blue-600">
            <Link to={"/"}>Go Home</Link>
          </div>
          <div className="text-blue-600">
            <Link to={"./.."}>Go to Product Page</Link>
          </div>
        </div>
        <div className="my-10 border w-1/3 text-center">
          {formError && <p className="text-red-600">{formError}</p>}
          <div className="text-2xl tracking-wider mb-3">Select Winner:</div>
          <form onSubmit={handleSubmit} className="flex justify-between">
            <div>
              <select value={winner} onChange={handleChange}>
                <option value={-1}>No Winner</option>
                {uniqueBids.map((b) => (
                  <option key={b.id} value={b.bidderId}>
                    {b.bidder}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button className="py-2 px-4 bg-green-700 rounded-lg text-white">
                Submit
              </button>
            </div>
          </form>
        </div>
        {bids.length !== 0 ? (
          <>
            <div className="font-thin text-2xl text-center tracking wider mb-2">
              Bids for {bids[0].productName}
            </div>

            <table className="w-full border">
              <thead className="bg-bray-50">
                <tr className="text-left text-gray-600 font-medium uppercase tracking-wider">
                  <th className="py-3 px-6">Bidder Name</th>
                  <th className="py-3 px-6">Bidder Email</th>
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
                    <td className=" text-lg px-6 py-4 whitespace-nowrap">
                      {b.bidderEmail}
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
          </>
        )}
      </div>
    </div>
  );
};
