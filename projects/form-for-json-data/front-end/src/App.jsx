import React, { useState, useEffect } from "react";

function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    termsAccepted: false,
    comments: "",
  });

  const [users, setUsers] = useState([]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.termsAccepted) {
      alert("You must accept the terms and conditions before submitting.");
      return;
    }

    try {
      let res = await fetch("/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      let result = await res.json();
      alert(result.message);

      fetchUsers(); // refresh list after submit

      setForm({
        name: "",
        email: "",
        password: "",
        gender: "",
        termsAccepted: false,
        comments: "",
      });
    } catch (err) {
      console.error("Error saving user:", err);
      alert("Failed to save user.");
    }
  };

  const fetchUsers = async () => {
    try {
      let res = await fetch("/users");
      let data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg my-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Form Demo
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <div className="mt-2 flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={form.gender === "male"}
                onChange={handleChange}
              />
              <span className="ml-2 text-gray-700">Male</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={form.gender === "female"}
                onChange={handleChange}
              />
              <span className="ml-2 text-gray-700">Female</span>
            </label>
          </div>
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={form.termsAccepted}
              onChange={handleChange}
            />
            <span className="ml-2 text-sm text-gray-700">
              Accept Terms and Conditions
            </span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Comments
          </label>
          <textarea
            name="comments"
            value={form.comments}
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            placeholder="Your comments"
            rows="4"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Submit Form
        </button>
      </form>

      <div className="mt-8 p-4 bg-gray-50 rounded-md">
        <h2 className="text-xl font-semibold text-gray-800">All Users</h2>
        <ul className="mt-4 space-y-2">
          {users.map((u, i) => (
            <li key={i} className="border-b pb-2">
              <p>
                <strong>Name:</strong> {u.name}
              </p>
              <p>
                <strong>Email:</strong> {u.email}
              </p>
              <p>
                <strong>Gender:</strong> {u.gender}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
