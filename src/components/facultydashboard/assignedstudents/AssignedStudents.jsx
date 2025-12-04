import React, { useState } from "react";

const STUDENTS = [
  { name: "Aditi Verma", roll: "CS101", progress: 80 },
  { name: "Rahul Singh", roll: "CS102", progress: 60 },
  { name: "Sneha P", roll: "CS103", progress: 92 },
];

export default function AssignedStudents() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Assigned Students</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Roll No</th>
              <th className="p-3">Progress</th>
            </tr>
          </thead>

          <tbody>
            {STUDENTS.map((s) => (
              <tr
                key={s.roll}
                className="hover:bg-indigo-50 cursor-pointer"
                onClick={() => setSelected(s)}
              >
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.roll}</td>
                <td className="p-3">{s.progress}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80">
            <h2 className="font-bold text-xl mb-2">{selected.name}</h2>
            <p>Roll No: {selected.roll}</p>
            <p>Progress: {selected.progress}%</p>

            <button
              onClick={() => setSelected(null)}
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
