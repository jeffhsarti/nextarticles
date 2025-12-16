"use client";

import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

import { PAGE_LMIT } from "@/utils/constant";
import moment from "moment";
import _ from "lodash";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalArticles, setTotalArticles] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);

  const convertTime = (timestamp: string) =>
    moment.unix(Number(timestamp)).local().format("YYYY-MM-DD HH:mm:ss");
  const splitCategory = (category: string) => _.split(category, "|");

  const getArticles = async () => {
    try {
      const res = await fetch("/api/news");
      const data = await res.json();

      setTotalArticles(data || []);
    } catch (e) {
      console.error("Error in get articles", e);
    }
  };

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    getArticles();
  }, []);

  useEffect(() => {
    const startOffset = currentPage * PAGE_LMIT;
    const endOffset = startOffset + PAGE_LMIT;
    setArticles(totalArticles.slice(startOffset, endOffset));
  }, [currentPage, totalArticles]);

  const pageCount = Math.ceil(totalArticles.length / PAGE_LMIT);

  return (
    <main>
      <div className="relative w-full h-[500px] bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05')]">
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">
              Welcome to Business News
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-8 mx-auto">
        {articles.map((atcl, index) => (
          <article
            key={index}
            className={`mb-12 ${
              index !== articles.length - 1 ? "rounded shadow p-4" : ""
            }`}
          >
            <div className="flex flex-col md:flex-row gap-4">
              <img
                src={atcl.image_url}
                className="w-full md:w-64 md:h-64 mx-auto"
                alt="news"
              />
              <div className="block">
                <div className="text-white hover:text-[#0085A1] cursor-pointer">
                  <h2 className="text-4xl font-bold transition-colors mb-2">
                    <a
                      href={atcl.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {atcl.title}
                    </a>
                  </h2>
                </div>
                <div className="text-lg">
                  {atcl.body.length > 255
                    ? `${atcl.body
                        .slice(0, 200)
                        .split(" ")
                        .slice(0, -1)
                        .join(" ")}...`
                    : atcl.body}
                </div>
                <div className="text-gray-500 py-2">
                  {convertTime(atcl.published_on)}
                </div>
                <div className="flex flex-row flex-wrap gap-2 text-blue-600">
                  {splitCategory(atcl.category).map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="bg-blue-100 rounded-xl px-4 py-1 text-sm"
                      >
                        {item}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      <div>
        {pageCount > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            <ReactPaginate
              breakLabel="..."
              nextLabel="next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              previousLabel="< previous"
              containerClassName="flex items-center space-x-2"
              pageClassName="px-3 py-1 border border-gray-300 rounded cursor-pointer"
              activeClassName="bg-gray-800 text-white"
              previousClassName="px-3 py-1 border border-gray-300 rounded cursor-pointer"
              nextClassName="px-3 py-1 border border-gray-300 rounded cursor-pointer"
              disabledClassName="opacity-50 cursor-not-allowed"
            />
          </div>
        )}
      </div>
    </main>
  );
}
