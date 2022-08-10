import { useDebugValue, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import BidService from "../service/BidService";

const ProductBidPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [bid, setBid] = useState({});
  const [notFound, setNotFound] = useState(false);

  const [img, setImg] = useState(null);

  const [bidAmount, setBidAmount] = useState("");

  const [bidAmountError, setBidAmountError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    if (isSubmitted && Number(bidAmount) > 0) {
      BidService.placeBidforProduct(user.token, bid.id, user.id, bidAmount)
        .then((response) => {
          setFormSuccess(response.data?.message);
          setFormError("");
        })
        .catch((error) => {
          setFormError(error.response.data.message);
          setFormSuccess("");
          setIsSubmitted(false);
        });
      setBidAmount("");
    }
  }, [bidAmountError, isSubmitted]);

  useEffect(() => {
    BidService.getBidById(user.token, id)
      .then((response) => {
        setBid(response.data);
        setNotFound(false);
      })
      .catch((error) => {
        setBid({});
        setNotFound(true);
      });
  }, [id, formSuccess, formError]);

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

  function handleChange(event) {
    const { value } = event.target;
    setBidAmount(value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setBidAmountError(validate(bidAmount));
  }

  function validate(value) {
    let error = "";
    const numberRegex = new RegExp(
      /^(?:-(?:[1-9](?:\d{0,2}(?:,\d{3})+|\d*))|(?:0|(?:[1-9](?:\d{0,2}(?:,\d{3})+|\d*))))(?:.\d+|)$/
    );

    if (!String(value).match(numberRegex)) {
      error = "Bid amount should be a real number!";
    } else if (String(value).includes(",")) {
      error = "Please don't use comma!";
    } else if (Number(value) < bid.minBidAmount) {
      error = "Bid amount cannot be less than minimum Bid amount!";
    } else {
      error = "";
    }

    if (error.length === 0) {
      setIsSubmitted(true);
    }

    return error;
  }

  return (
    <div className="my-3 flex max-w-4xl mx-auto shadow border-b">
      <div className="px-8 py-8 w-full">
        <div className="mb-5">
          <Link to="/" className="text-blue-400">
            Back to home
          </Link>
        </div>
        {!notFound ? (
          <>
            <div className="font-thin text-2xl tracking wider mb-10">
              Bid details
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
                <p className="block font-normal">{bid.minBidAmount}</p>
              </div>

              <div className="flex items-center justify-between my-5">
                <p className="block font-normal">End Time</p>
                <p className="block font-normal">
                  {new Date(bid.endTime).toLocaleString()}
                </p>
              </div>
              <p className="text-green-700">{formSuccess}</p>
              <p className="text-red-700">{formError}</p>
              {bid.ownerId !== user.id &&
                user.id !== bid.latestBidderId &&
                !user.roles?.includes("ROLE_ADMIN") && (
                  <form onSubmit={handleSubmit}>
                    <div className="items-center my-5">
                      <label htmlFor="amount" className="block font-normal">
                        Enter your bid amount:
                      </label>
                      <input
                        id="amount"
                        onChange={(e) => handleChange(e)}
                        value={bidAmount}
                        className="w-96 border mt-2 px-2 py-2"
                        placeholder="Amount in tg"
                        type="text"
                      />
                      <p className="text-red-600">{bidAmountError}</p>
                    </div>
                    <button className="bg-green-600 text-white py-1 px-6">
                      Bid
                    </button>
                  </form>
                )}
              <div className="flex items-center justify-between mt-10 mb-5">
                <Link className="block font-normal underline" to="all">
                  View bids for this product
                </Link>
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

export { ProductBidPage };
