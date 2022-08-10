import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import BidService from "../service/BidService";

function ProductBid({ productBid }) {
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
          <td className="text-sm px-6 py-4 whitespace-nowrap">
            <Link to={`/bids/${productBid.id}`} className=" text-sky-800">
              {productBid.name}
            </Link>
          </td>
          <td className="text-sm px-6 py-4 whitespace-nowrap">
            {productBid.owner}
          </td>
          <td className="text-sm px-6 py-4 whitespace-nowrap">
            {productBid.minBidAmount} tg
          </td>
          <td className="text-sm px-6 py-4 whitespace-nowrap">
            {new Date(Date.parse(productBid.endTime)).toLocaleString()}
          </td>
        </tr>
      )}
    </>
  );
}

export default ProductBid;
