function Dialog({ message, onDialog }) {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50">
      <div className="bg-white p-5 flex flex-col items-center justify-center absolute top-1/3 left-1/2 -translate-x-1/2  -translate-y-1/3">
        <h3 className="text-black font-semibold">{message}</h3>
        <div className="mt-3 flex items-center text-white space-x-5">
          <button
            onClick={() => onDialog(true)}
            className="bg-green-700 rounded py-1 px-3 hover:bg-green-800"
          >
            Confirm
          </button>
          <button
            onClick={() => onDialog(false)}
            className="bg-gray-700 rounded py-1 px-3 hover:bg-gray-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dialog;
