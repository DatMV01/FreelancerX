import { useForm } from "react-hook-form";

export default function FormExample() {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      name: "",
      options: [],
      gender: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="mx-auto max-w-md rounded-lg bg-white p-4 shadow-lg">
      <h2 className="mb-4 text-lg font-semibold">User Form</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Input Text */}
        <div>
          <label className="block font-medium">Name:</label>
          <input
            type="text"
            {...register("name", { required: true })}
            className="w-full rounded-md border px-3 py-2"
            placeholder="Enter your name"
          />
        </div>

        {/* Checkbox Group */}
        <div>
          <label className="block font-medium">Select Options:</label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("options")}
                value="Option 1"
              />
              <span>Option 1</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("options")}
                value="Option 2"
              />
              <span>Option 2</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("options")}
                value="Option 3"
              />
              <span>Option 3</span>
            </label>
          </div>
        </div>

        {/* Radio Group */}
        <div>
          <label className="block font-medium">Select Gender:</label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="radio" {...register("gender")} value="Male" />
              <span>Male</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" {...register("gender")} value="Female" />
              <span>Female</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" {...register("gender")} value="Other" />
              <span>Other</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Submit
        </button>
      </form>

      {/* Display Selected Values */}
      <div className="mt-4">
        <h3 className="font-medium">Form Data:</h3>
        <p>
          <strong>Name:</strong> {watch("name") || "N/A"}
        </p>
        <p>
          <strong>Selected Options:</strong>{" "}
          {watch("options").join(", ") || "None"}
        </p>
        <p>
          <strong>Gender:</strong> {watch("gender") || "Not selected"}
        </p>
      </div>
    </div>
  );
}
