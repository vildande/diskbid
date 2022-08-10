import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export const Feedback = ({ feedback, onDelete }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  return (
    <>
      {!loading && (
        <tr className="text-left text-gray-700">
          <td className="text-base px-6 py-4 whitespace-nowrap">
            {feedback.sender}
          </td>
          <td className="text-sm px-6 py-4 whitespace-nowrap">
            {feedback.subject}
          </td>
          <td className="text-sm px-6 py-4 whitespace-nowrap overflow-auto">
            {feedback.description}
          </td>
          <td className="text-sm px-6 py-4 whitespace-nowrap">
            {new Date(feedback.time).toLocaleString()}
          </td>

          <td className="text-sm px-6 py-4 whitespace-nowrap">
            <button
              onClick={() => onDelete(feedback.id, feedback.subject)}
              className="bg-red-600 text-white py-2 px-3 rounded-md font-bold"
            >
              Delete
            </button>
          </td>
        </tr>
      )}
    </>
  );
};
