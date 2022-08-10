import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductBidPending from "../components/ProductBidPending";
import { useAuth } from "../hooks/useAuth";
import BidService from "../service/BidService";
import Dialog from "../components/Dialog";

function DeleteProductBidPage() {
  const navigate = useNavigate();
  const { user, signout } = useAuth();
  const [productBids, setProductBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateFlag, setUpdateFlag] = useState(false);

  const [dialog, setDialog] = useState({
    message: "",
    isLoading: false,
    idToDelete: null,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await BidService.getPendingBidsByOwnerId(
          user.token,
          user.id
        );
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
  }, [updateFlag]);

  const handleDelete = (id, name) => {
    setDialog({
      message: `Are you sure you want to delete ${name}?`,
      isLoading: true,
      idToDelete: id,
    });
  };

  const handleDialogAnswer = (answer) => {
    if (answer === true) {
      BidService.deletePendingProductBid(user.token, dialog.idToDelete)
        .then((response) => {
          console.log(response.data);
          setUpdateFlag((prevState) => !prevState);
        })
        .catch((error) => {
          console.error(error);
        });
    }

    setDialog({
      message: "",
      isLoading: false,
      idToDelete: null,
    });
  };

  return (
    <div>
      <div className="my-3 pb-4 max-w-7xl mx-auto flex shadow border-b">
        <div className="px-8 py-8 flex justify-between space-x-10 w-full">
          <div className="w-20 text-center mt-3">
            <Link to="/" className="text-blue-600">
              Go Home
            </Link>
          </div>
          <div className="container mx-auto">
            <div className="mb-4">
              <p className=" text-2xl tracking-wider mt-3 font-thin">
                Pending bids:
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
                      <th className="py-3 px-6">Minimum Bid</th>
                      <th className="py-3 px-6">Bid Step</th>
                      <th className="py-3 px-6">Duration</th>
                      <th className="py-3 px-6 text-center">Action</th>
                    </tr>
                  </thead>
                  {!loading && (
                    <tbody className="bg-white ">
                      {productBids.map((productBid) => (
                        <ProductBidPending
                          key={productBid.id}
                          productBid={productBid}
                          onDelete={handleDelete}
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
      {dialog.isLoading && (
        <Dialog message={dialog.message} onDialog={handleDialogAnswer} />
      )}
    </div>
  );
}

export default DeleteProductBidPage;
