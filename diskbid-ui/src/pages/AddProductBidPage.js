import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import BidService from "../service/BidService";

const AddProductBidPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [productBidData, setProductBidData] = useState({
    name: "",
    description: "",
    startAmount: "",
    step: "",
    minutes: "",
    ownerId: user.id,
    owner: user.username,
    image: null,
  });

  const [productBidErrors, setProductBidErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (isSubmitted) {
      BidService.sendProductForBid(user.token, productBidData)
        .then((response) => {
          console.log(response);
          navigate("/");
        })
        .catch((error) => {
          setFormError(error.response.data.message);
          setIsSubmitted(false);
        });
    }
  }, [productBidErrors]);

  function handleChange(event) {
    const { name, value } = event.target;
    setProductBidData((prevData) => ({ ...prevData, [name]: value }));
  }

  function handleChangeFile(event) {
    const { name, files } = event.target;
    setProductBidData((prevData) => ({
      ...prevData,
      [name]: files.length > 0 ? files[0] : null,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setProductBidErrors(validate(productBidData));
  }

  const validate = (values) => {
    const errors = {};
    const realNumberRegex = new RegExp(
      /^(?:-(?:[1-9](?:\d{0,2}(?:,\d{3})+|\d*))|(?:0|(?:[1-9](?:\d{0,2}(?:,\d{3})+|\d*))))(?:.\d+|)$/
    );

    const intNumberRegex = new RegExp("^[0-9]+$");

    if (
      String(values.name).trim().length < 3 ||
      String(values.name).trim().length > 255
    ) {
      errors.title = "Name should be at least 3 and max 255 characters long!";
    }

    if (
      String(values.description).trim().length < 3 ||
      String(values.description).trim().length > 255
    ) {
      errors.description =
        "Description should be at least 3 and max 255 characters long!";
    }

    if (!String(values.startAmount).match(realNumberRegex)) {
      errors.startAmount = "Bid amount should be a real number!";
    } else if (String(values.startAmount).includes(",")) {
      errors.startAmount = "Please don't use comma!";
    } else if (
      Number(values.startAmount) < 1000 ||
      Number(values.startAmount) > 10000000
    ) {
      errors.startAmount =
        "Start bid amount cannot be less than 1000 and more than 10000000!!";
    }

    if (!String(values.step).match(realNumberRegex)) {
      errors.step = "Bid step amount should be a real number!";
    } else if (String(values.step).includes(",")) {
      errors.step = "Please don't use comma!";
    } else if (Number(values.step) < 1000 || Number(values.step) > 10000000) {
      errors.step =
        "Step bid amount cannot be less than 1000 and more than 10000000!!";
    }

    if (!String(values.minutes).match(intNumberRegex)) {
      errors.minutes = "Minutes should be an integer number!";
    } else if (Number(values.minutes) < 5 || Number(values.minutes) > 4320) {
      errors.minutes =
        "Minutes should cannot be less than 5 and more than 4320!";
    }

    if (values.image == null) {
      errors.image = "File not selected!";
    } else if (values.image.size > 5 * 1024 * 1024) {
      errors.image = "File size cannot exceed 5MB!";
    }

    if (Object.keys(errors).length === 0) {
      setIsSubmitted(true);
    }

    return errors;
  };

  return (
    <div className="my-3 flex max-w-4xl mx-auto shadow border-b">
      <div className="px-8 py-8 w-full">
        <div className="mb-5">
          <Link to="/" className="text-blue-400">
            Back to home
          </Link>
        </div>
        <div className="font-thin text-2xl tracking-wider">
          Add Product to bidding
        </div>
        <p className="text-red-600">{formError}</p>
        <form
          onSubmit={handleSubmit}
          method="post"
          encType="multipart/form-data"
        >
          <div className="items-center justify-center w-96 my-4">
            <label
              className="block text-gray-600 text-sm font-normal"
              htmlFor="name"
            >
              Enter Product Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={productBidData.name}
              onChange={(e) => handleChange(e)}
              className="w-96 border mt-2 px-2 py-2"
            />
            <p className="text-red-600">{productBidErrors.name}</p>
          </div>

          <div className="items-center justify-center w-96 my-4">
            <label
              className="block text-gray-600 text-sm font-normal"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={productBidData.description}
              onChange={(e) => handleChange(e)}
              className="w-96 border mt-2 px-2 py-2"
            />
            <p className="text-red-600">{productBidErrors.description}</p>
          </div>

          <div className="items-center justify-center w-96 my-4">
            <label
              className="block text-gray-600 text-sm font-normal"
              htmlFor="startAmount"
            >
              Start bid amount (in tg)
            </label>
            <input
              name="startAmount"
              id="startAmount"
              type="text"
              value={productBidData.startAmount}
              onChange={(e) => handleChange(e)}
              className="w-96 border mt-2 px-2 py-2"
            />
            <p className="text-red-600">{productBidErrors.startAmount}</p>
          </div>

          <div className="items-center justify-center w-96 my-4">
            <label
              className="block text-gray-600 text-sm font-normal"
              htmlFor="step"
            >
              Bid Step amount (in tg)
            </label>
            <input
              name="step"
              id="step"
              type="text"
              value={productBidData.step}
              onChange={(e) => handleChange(e)}
              className="w-96 border mt-2 px-2 py-2"
            />
            <p className="text-red-600">{productBidErrors.step}</p>
          </div>

          <div className="items-center justify-center w-96 my-4">
            <label
              className="block text-gray-600 text-sm font-normal"
              htmlFor="minutes"
            >
              Auction time (in minutes)
            </label>
            <input
              name="minutes"
              id="minutes"
              type="text"
              value={productBidData.minutes}
              onChange={(e) => handleChange(e)}
              className="w-96 border mt-2 px-2 py-2"
            />
            <p className="text-red-600">{productBidErrors.minutes}</p>
          </div>

          <div className="items-center justify-center w-96 my-4">
            <label
              className="block text-gray-600 text-sm font-normal mb-2"
              htmlFor="image"
            >
              Product Image
            </label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              name="image"
              id="image"
              onChange={handleChangeFile}
            />
            <p className="text-red-600">{productBidErrors.image}</p>
          </div>

          <div className="items-center justify-center w-96 my-4 space-x-4 pt-4">
            <button className="rounded text-white font-semibold bg-slate-600 hover:bg-slate-700  py-2 px-6">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductBidPage;
