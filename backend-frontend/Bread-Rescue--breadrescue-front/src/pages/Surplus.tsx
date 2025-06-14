import { useState } from "react";

const Surplus = () => {
  const [form, setForm] = useState({ quantity: '', description: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bread-50">
        <h1 className="text-2xl font-bold mb-4">Surplus submitted!</h1>
        <p>Thank you for helping reduce food waste.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bread-50">
      <h1 className="text-2xl font-bold mb-4">Submit Detected Surplus</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80 bg-white p-8 rounded shadow">
        <input
          type="number"
          name="quantity"
          placeholder="Quantity (kg)"
          value={form.quantity}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-bread-500 text-white py-2 rounded hover:bg-bread-600">
          Submit Surplus
        </button>
      </form>
    </div>
  );
};

export default Surplus; 
