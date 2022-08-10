import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import BidService from "../service/BidService";
import Dialog from "../components/Dialog";

export const ProductBidPendingAdminPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [bid, setBid] = useState({});
  const [notFound, setNotFound] = useState(false);

  const [img, setImg] = useState(null);

  const [acceptDialog, setAcceptDialog] = useState({
    message: "",
    isLoading: false,
    idToAccept: null,
  });

  const [deleteDialog, setDeleteDialog] = useState({
    message: "",
    isLoading: false,
    idToDelete: null,
  });

  useEffect(() => {
    BidService.getByAdminPendingBid(user.token, id)
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

  const handleDelete = (id, name) => {
    setDeleteDialog({
      message: `Are you sure you want to DELETE ${name}?`,
      isLoading: true,
      idToDelete: id,
    });
  };

  const handleAccept = (id, name) => {
    setAcceptDialog({
      message: `Are you sure you want to ACCEPT ${name}?`,
      isLoading: true,
      idToAccept: id,
    });
  };

  const handleDeleteDialogAnswer = (answer) => {
    if (answer === true) {
      BidService.deleteByAdminPendingProductBid(
        user.token,
        deleteDialog.idToDelete
      )
        .then((response) => {
          console.log(response.data);
          <Navigate to="./.." replace={true} />;
        })
        .catch((error) => {
          console.error(error);
        });
    }

    setDeleteDialog({
      message: "",
      isLoading: false,
      idToDelete: null,
    });
  };

  const handleAcceptDialogAnswer = (answer) => {
    if (answer === true) {
      BidService.acceptPendingProductBid(user.token, acceptDialog.idToAccept)
        .then((response) => {
          //   console.log(response.data);
          <Navigate to="./.." replace={true} />;
        })
        .catch((error) => {
          console.error(error);
        });
    }

    setAcceptDialog({
      message: "",
      isLoading: false,
      idToAccept: null,
    });
  };

  return (
    <div className="my-3 flex max-w-4xl mx-auto shadow border-b">
      <div className="px-8 py-8 w-full">
        <div className="flex flex-col space-y-2 mb-5">
          <Link to="/" className="text-blue-400">
            Back to home
          </Link>
          <Link to="./.." className="text-blue-400">
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
                <p className="block font-normal overflow-auto">
                  {bid.description}
                </p>
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

              <div className="text-sm px-6 py-4 whitespace-nowrap text-center">
                <button
                  onClick={() => handleAccept(bid.id, bid.name)}
                  className="bg-green-600 text-white py-2 px-3 rounded-md font-bold mr-2"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDelete(bid.id, bid.name)}
                  className="bg-red-600 text-white py-2 px-3 rounded-md font-bold ml-2"
                >
                  Delete
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1>Cannot find the bid.</h1>
          </>
        )}
      </div>
      {deleteDialog.isLoading && (
        <Dialog
          message={deleteDialog.message}
          onDialog={handleDeleteDialogAnswer}
        />
      )}
      {acceptDialog.isLoading && (
        <Dialog
          message={acceptDialog.message}
          onDialog={handleAcceptDialogAnswer}
        />
      )}
    </div>
  );
};
