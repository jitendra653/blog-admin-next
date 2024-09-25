"use client";

import { PieChart } from "@mui/x-charts";
import React, { useEffect, useState } from "react";
import loaderStore from "../stores/loaderStore";

const Page: React.FC = () => {

  const [statistics, setStatistics] = useState({ categoryOverview: [], tagsOverview: [], totalBlogs: '-', draftBlogs: '-', totalTagsCount: '-', totalTags: [], totalCategory: [], totalCategoryCount: '-' });


  useEffect(() => {
    loaderStore.show();
    fetch(`/api/statistics`)
      .then((response) => response.json())
      .then((data) => {
        setStatistics(data);
        loaderStore.hide();
      })
      .catch((error) => console.error('Error fetching post data:', error));
  }, [])

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col p-6">
      <section className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-purple-500 text-white rounded-xl p-4 text-center shadow-lg">
          <h3 className="text-xl font-bold">Total Blogs</h3>
          <p className="text-3xl mt-2">{statistics?.totalBlogs || 0}</p>
        </div>
        <div className="bg-pink-500 text-white rounded-xl p-4 text-center shadow-lg">
          <h3 className="text-xl font-bold">Total Category</h3>
          <p className="text-3xl mt-2">{statistics?.totalCategoryCount}</p>
        </div>
        <div className="bg-yellow-500 text-white rounded-xl p-4 text-center shadow-lg">
          <h3 className="text-xl font-bold">Total Tags</h3>
          <p className="text-3xl mt-2">{statistics?.totalTagsCount}</p>
        </div>
        <div className="bg-blue-500 text-white rounded-xl p-4 text-center shadow-lg">
          <h3 className="text-xl font-bold">Draft Blogs</h3>
          <p className="text-3xl mt-2">{statistics?.draftBlogs}</p>
        </div>
      </section>

      <div className="flex gap-6 mb-6">
        {statistics?.categoryOverview && (
          <section className="bg-white w-full p-6 rounded-xl shadow-md flex gap-2">

            {statistics?.categoryOverview?.[0] && (
              <div className="w-1/2">
                <h3 className="text-xl font-bold mb-4">Blogs Category</h3>
                <div className="h-64 bg-blue-100 rounded-xl flex items-center justify-center">
                  <div className="flex-1 ">
                    <PieChart
                        series={[
                        {
                          data: statistics?.categoryOverview,
                        },
                      ]}
                      width={400}
                      height={200}
                    />
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

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
              {statistics?.tagsOverview.map((value:any, i) => (
                <tr key={i}>
                  <td className="py-2">{value?.text || 'Other'}</td>
                  <td className="py-2">{value?.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <div className="flex gap-6"></div>
    </main>
  )
};

export default Page;
