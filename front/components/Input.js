import { useEffect, forwardRef } from "react";

export default forwardRef(function Input(prop, ref) {
  useEffect(() => {
    ref.current.focus();
  }, []);
  return (
    <div>
      <label
        htmlFor={prop.id}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {prop.name}
      </label>
      <input
        onChange={prop.onChange}
        onKeyDown={prop.onKeyDown}
        type={prop.id}
        name={prop.id}
        ref={ref}
        id={prop.id}
        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder={prop.placeholder}
        required=""
      ></input>{" "}
      <div className="font-light text-red-500 dark:text-gray-300">
        {prop.valid_text}
      </div>
    </div>
  );
});
