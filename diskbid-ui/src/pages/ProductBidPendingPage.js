import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import BidService from "../service/BidService";

const ProductBidPendingPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [bid, setBid] = useState({});
  const [notFound, setNotFound] = useState(false);

  const [img, setImg] = useState(null);

  useEffect(() => {
    BidService.getPendingBid(user.token, user.id, id)
      .then((response) => {
        setBid(response.data);
        setNotFound(false);
      })
      .catch((error) => {
        console.error(error);
        setBid({});
        setNotFound(true);
      });
  }, [id]);

  useEffect(() => {
    const fetchImage = async () => {
      const image = await BidService.getImage(user.token, bid.image).then(
        (res) => {
          setImg(URL.createObjectURL(res.data));
        }
      );
      return image;
    };

    fetchImage();
  }, [bid]);

  return (
    <div className="my-3 flex max-w-4xl mx-auto shadow border-b">
      <div className="px-8 py-8 w-full">
        <div className="flex flex-col space-y-2 mb-5">
          <Link to="/" className="text-blue-400">
            Back to home
          </Link>
          <Link to="/bids/delete" className="text-blue-400">
            Back to pending bids
          </Link>
        </div>
        {!notFound ? (
          <>
            <div className="font-thin text-2xl tracking wider mb-10">
              Pending Bid details
            </div>
            <div className="px-10">
              {img ? (
                <img
                  src={img}
                  alt="image"
                  className="mx-auto my-5 h-64 w-64 object-cover bg-center bg-white border rounded"
                />
              ) : (
                <div className="flex items-center justify-center my-5 h-64 border">
                  <p className="block font-normal text-lg">
                    -No Product Image-
                  </p>
                </div>
              )}
              <div className="flex items-center justify-between my-5">
                <p className="block font-normal">Product Name</p>
                <p className="block font-normal">{bid.name}</p>
              </div>
              <div className="flex items-center justify-between my-5">
                <p className="block font-normal">Product Description</p>
                <p className="block font-normal">{bid.description}</p>
              </div>
              <div className="flex items-center justify-between my-5">
                <p className="block font-normal">Owner</p>
                <p className="block font-normal">{bid.owner}</p>
              </div>
              <div className="flex items-center justify-between my-5">
                <p className="block font-normal">Minimum Bid</p>
                <p className="block font-normal">{bid.minBidAmount} tg</p>
              </div>

              <div className="flex items-center justify-between my-5">
                <p className="block font-normal">Bid Step</p>
                <p className="block font-normal">{bid.bidStep} tg</p>
              </div>

              <div className="flex items-center justify-between my-5">
                <p className="block font-normal">Duration</p>
                <p className="block font-normal">{bid.minutes} minutes</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1>Cannot find the bid.</h1>
          </>
        )}
      </div>
    </div>
  );
};

export { ProductBidPendingPage };
