import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FeedbackService from "../service/FeedbackService";
import { useAuth } from "../hooks/useAuth";

const FeedbackPage = () => {
  const { user } = useAuth();
  const [feedbackData, setFeedbackData] = useState({
    subject: "",
    description: "",
    senderId: user.id,
  });

  const [feedbackErrors, setFeedbackErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  useEffect(() => {
    if (isSubmitted) {
      FeedbackService.sendFeedback(user.token, feedbackData)
        .then((response) => {
          setFormSuccess(response.data.message);
          setFeedbackData((prevData) => ({
            ...prevData,
            subject: "",
            description: "",
          }));
        })
        .catch((error) => {
          setFormError(error.response.data.message);
          setIsSubmitted(false);
        });
    }
  }, [feedbackErrors]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFeedbackData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFeedbackErrors(validate(feedbackData));
  };

  const validate = (values) => {
    const errors = {};

    if (
      String(values.subject).trim().length < 3 ||
      String(values.subject).trim().length > 255
    ) {
      errors.subject =
        "Subject should be at least 3 and max 255 characters long!";
    }
    if (
      String(values.description).trim().length < 10 ||
      String(values.description).trim().length > 255
    ) {
      errors.description =
        "Description should be at least 10 and max 255 characters long!";
    }

    if (Object.keys(errors).length === 0) {
      setIsSubmitted(true);
    } else {
      setIsSubmitted(false);
    }

    return errors;
  };

  return (
    <div>
      <div className="my-3 flex max-w-2xl mx-auto shadow border-b">
        <div className="px-8 py-8">
          <div className="mb-5">
            <Link to="/" className="text-blue-400">
              Back to home
            </Link>
          </div>
          <div className="font-thin text-2xl tracking wider">Feedback</div>
          <p className="text-red-600">{formError}</p>
          <p className="text-green-600">{formSuccess}</p>
          <form onSubmit={handleSubmit}>
            <div className="items-center justify-center w-96 my-4">
              <label
                className="block text-gray-600 text-sm font-normal"
                htmlFor="subject"
              >
                Subject
              </label>
              <input
                type="text"
                name="subject"
                id="subject"
                value={feedbackData.subject}
                onChange={(e) => handleChange(e)}
                className="w-96 border mt-2 px-2 py-2"
              />
              <p className="text-red-600">{feedbackErrors.subject}</p>
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
                value={feedbackData.description}
                onChange={(e) => handleChange(e)}
                className="w-96 border mt-2 px-2 py-2"
              />
              <p className="text-red-600">{feedbackErrors.description}</p>
            </div>

            <div className="items-center justify-center w-96 my-4 space-x-4 pt-4">
              <button className="rounded text-white font-semibold bg-slate-600 hover:bg-slate-700  py-2 px-6">
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export { FeedbackPage };
