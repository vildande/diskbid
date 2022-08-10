import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import BidService from "../service/BidService";

function ProductBidPending({ productBid, onDelete }) {
  const { user } = useAuth();
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      const image = await BidService.getImage(
        user.token,
        productBid.image
      ).then((res) => {
        setImg(URL.createObjectURL(res.data));
      });
      return image;
    };

    setLoading(true);
    fetchImage();
    setLoading(false);
  }, []);

  return (
    <>
      {!loading && (
        <tr className="text-left text-gray-700">
          <td className="text-sm px-3 py-1 whitespace-nowrap">
            <img
              src={img}
              alt="image"
              className="object-cover bg-center h-28 w-28 bg-white border rounded"
            />
          </td>
          <td className="text-base px-6 py-4 whitespace-nowrap">
            <Link
              to={`/bids/delete/${productBid.id}`}
              className=" text-sky-800"
            >
              {productBid.name}
            </Link>
          </td>

          <td className="text-sm px-6 py-4 whitespace-nowrap">
            {productBid.minBidAmount} tg
          </td>
          <td className="text-sm px-6 py-4 whitespace-nowrap">
            {productBid.bidStep} tg
          </td>
          <td className="text-sm px-6 py-4 whitespace-nowrap">
            {productBid.minutes} minutes
          </td>

          <td className="text-sm px-6 py-4 whitespace-nowrap text-center">
            <button
              onClick={() => onDelete(productBid.id, productBid.name)}
              className="bg-red-600 text-white py-2 px-3 rounded-md font-bold"
            >
              Delete
            </button>
          </td>
        </tr>
      )}
    </>
  );
}

export default ProductBidPending;
