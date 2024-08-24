"use client";

import { LineChart, PieChart } from "@mui/x-charts";
import Image from "next/image";

const Page: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col p-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Blogs Dashboard</h2>
          <p className="text-sm text-gray-500">Admin Panel</p>
        </div>
        <div className="flex items-center space-x-4">
          <Image
          width={20}
          height={20}
            src="/uploads/bell--v1.png"
            alt="Notifications"
            className="h-6 w-6"
          />
          <Image
          width={10}
          height={20}
            src="/uploads/user-male-circle--v1.png"
            alt="User Profile"
            className="h-10 w-10 rounded-full"
          />
        </div>
      </header>

      <section className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-purple-500 text-white rounded-xl p-4 text-center shadow-lg">
          <h3 className="text-xl font-bold">Total Blogs</h3>
          <p className="text-3xl mt-2">8</p>
        </div>
        <div className="bg-pink-500 text-white rounded-xl p-4 text-center shadow-lg">
          <h3 className="text-xl font-bold">Total Topics</h3>
          <p className="text-3xl mt-2">4</p>
        </div>
        <div className="bg-yellow-500 text-white rounded-xl p-4 text-center shadow-lg">
          <h3 className="text-xl font-bold">Total Tags</h3>
          <p className="text-3xl mt-2">6</p>
        </div>
        <div className="bg-blue-500 text-white rounded-xl p-4 text-center shadow-lg">
          <h3 className="text-xl font-bold">Draft Blogs</h3>
          <p className="text-3xl mt-2">1</p>
        </div>
      </section>

      <div className="flex gap-6 mb-6">
        <section className="bg-white w-full p-6 rounded-xl shadow-md flex flex-col">
          <h3 className="text-xl font-bold mb-4">Year Overview</h3>
          <div className="h-64 bg-blue-100 rounded-xl flex items-center justify-center">
            <p>Chart Placeholder</p> {/* Replace this with an actual chart */}
          </div>
        </section>

        <section className="bg-white p-6 w-2/6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold mb-4">Blogs By Category</h3>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2">Topics</th>
                <th className="py-2">Data</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2">Html, Css & JavaScript</td>
                <td className="py-2">3</td>
              </tr>
              <tr>
                <td className="py-2">Next Js, React Js</td>
                <td className="py-2">3</td>
              </tr>
              <tr>
                <td className="py-2">Database</td>
                <td className="py-2">2</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 shadow-md">
          <LineChart
            className="w-full"
            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
            series={[{ data: [2, 5.5, 2, 8.5, 1.5, 5] }]}
            width={500}
            height={300}
          />
        </div>

        <div className="flex-1 shadow-md">
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: 10, label: "series A" },
                  { id: 1, value: 15, label: "series B" },
                  { id: 2, value: 20, label: "series C" },
                ],
              },
            ]}
            width={400}
            height={200}
          />
        </div>
      </div>
    </main>
  );
};

export default Page;
