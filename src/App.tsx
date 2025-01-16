import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { throttle } from "lodash";
import { Person } from "./type";

const App = () => {
  const initialCount = 100; // 처음 요청할 데이터 수
  const increment = 20; // 스크롤마다 추가로 가져올 데이터 수

  // * REF
  const containerRef = useRef<HTMLDivElement>(null);

  // * URL
  const url = process.env.REACT_APP_API_URL;
  const params = process.env.REACT_APP_API_PARAMS;
  const apiUrl = (currentCount: number) =>
    `${url}?_quantity=${currentCount}&${params}`;

  // * STATE
  const [gridData, setGridData] = useState<Person[]>([]);
  const [filteredData, setFilteredData] = useState(gridData);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [count, setCount] = useState<number>(initialCount);

  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [sortKey, setSortKey] = useState<keyof Person | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const [searchColumn, setSearchColumn] = useState("id");
  const [searchParams, setSearchParams] = useState<any>("");

  // * EVENT

  // FETCH
  const fetchGridData = async () => {
    if (isLoading) return; // 이미 로딩 중이면 함수 종료
    setIsLoading(true); // 로딩 상태 시작

    try {
      const response = await axios.get(apiUrl(count));
      const newData = response.data.data;

      // 새로 불러온 데이터 중에서 기존 데이터에 없는 것만 추가
      const uniqueData = newData.slice(gridData.length, newData.length);

      setGridData((prevData) => [...prevData, ...uniqueData]);
      setFilteredData((prevData) => [...prevData, ...uniqueData]);

      return response;
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 데이터 필터링
  // 검색 버튼 클릭 시 필터링 실행
  const handleSearch = () => {
    console.log(searchParams);

    const result = gridData.filter((person) => {
      if (searchColumn === "name") {
        // firstname과 lastname을 합쳐서 검색
        const fullName = `${person.firstname} ${person.lastname}`.toLowerCase();
        return fullName.includes(searchParams.toLowerCase());
      } else {
        return person[searchColumn]
          ?.toString()
          .toLowerCase()
          .includes(searchParams.toLowerCase());
      }
    });
    setFilteredData(result);
  };

  // 초기화 버튼
  const handleReset = () => {
    setFilteredData(gridData);
  };

  // 행 클릭 이벤트
  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // 정렬 함수
  const handleSort = (key: keyof Person) => {
    const newOrder = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    const sortedData = [...gridData].sort((a, b) => {
      if (a[key] < b[key]) return newOrder === "asc" ? -1 : 1;
      if (a[key] > b[key]) return newOrder === "asc" ? 1 : -1;
      return 0;
    });
    setSortKey(key);
    setSortOrder(newOrder);
    setFilteredData(sortedData);
  };

  // 정렬 표시를 위한 유틸리티 함수
  const getSortIndicator = (key: keyof Person) => {
    if (sortKey === key) {
      return <span className="text-xs">{sortOrder === "asc" ? "▲" : "▼"}</span>;
    }
    return <span className="text-xs">▼</span>;
  };

  // 체크박스 클릭 핸들러
  const handleRowSelection = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // 체크박스 전체선택
  const handleCheckboxAll = () => {
    if (selectedRows.length === gridData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(gridData.map((person) => person.id)); // 모두 선택
    }
  };

  // * EFFECT
  useEffect(() => {
    fetchGridData();
  }, [count]);

  // * 스크롤 이벤트 추가
  useEffect(() => {
    const handleContainerScroll = throttle(() => {
      if (
        containerRef.current &&
        containerRef.current.scrollTop + containerRef.current.clientHeight >=
          containerRef.current.scrollHeight - 3000 // scroll 높이에 따라 count 증가
      ) {
        setCount((prevCount) => prevCount + increment);
      }
    }, 300);

    const container = containerRef.current;
    container?.addEventListener("scroll", handleContainerScroll);

    return () => {
      container?.removeEventListener("scroll", handleContainerScroll);
      handleContainerScroll.cancel();
    };
  }, []);

  // * VIEW
  return (
    <>
      <div className="flex flex-col ">
        {/* header */}
        <header className="flex justify-between mt-12 mb-4">
          <h1 className="text-2xl font-bold mb-4 mt-4 ml-36">Grid</h1>

          <div className="flex justify-end mt-6 mr-36 gap-6">
            <select
              value={searchColumn}
              onChange={(e) => setSearchColumn(e.target.value)}
              className="border border-black bg-slate-200"
            >
              <option value="id">ID</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="birthday">Birthday</option>
            </select>
            <input
              type="text"
              placeholder="Search..."
              className="border border-black  bg-slate-200"
              value={searchParams}
              onChange={(e) => setSearchParams(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Search
            </button>
            <button
              onClick={handleReset}
              className="bg-black text-white px-4 py-2 rounded"
            >
              초기화
            </button>
          </div>
        </header>

        {/* table */}
        <div
          ref={containerRef}
          className="container mx-auto mt-4 max-h-[800px] overflow-y-auto"
        >
          <table className="table-auto w-full border-collapse border border-gray-400">
            <thead className="bg-slate-200 sticky top-0 z-10">
              <tr className="border">
                <th className="border border-gray-400 px-4 py-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 border border-gray-400 rounded-lg"
                    checked={selectedRows.length === gridData.length}
                    onChange={handleCheckboxAll}
                  />
                </th>
                <th className="border border-gray-400 px-4 py-2"></th>
                <th
                  className="border border-gray-400 px-4 py-2 cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  ID {getSortIndicator("id")}
                </th>
                <th
                  className="border border-gray-400 px-4 py-2 cursor-pointer"
                  onClick={() => handleSort("firstname")}
                >
                  Name {getSortIndicator("firstname")}
                </th>

                <th
                  className="border border-gray-400 px-4 py-2 cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  Email {getSortIndicator("email")}
                </th>
                <th
                  className="border border-gray-400 px-4 py-2 cursor-pointer"
                  onClick={() => handleSort("phone")}
                >
                  Phone {getSortIndicator("phone")}
                </th>
                <th
                  className="border border-gray-400 px-4 py-2 cursor-pointer"
                  onClick={() => handleSort("birthday")}
                >
                  Birthday {getSortIndicator("birthday")}
                </th>
                <th className="border border-gray-400 px-4 py-2 cursor-pointer">
                  Website
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((person) => {
                const isExpanded = expandedRows.includes(person.id);
                return (
                  <React.Fragment key={person.id}>
                    {/* 메인 행 */}
                    <tr
                      className="cursor-pointer"
                      onClick={(event) => {
                        // 행 클릭 시 체크박스를 클릭하지 않았다면 확장/축소
                        if (
                          !(event.target as HTMLElement).closest(
                            'input[type="checkbox"]'
                          )
                        ) {
                          toggleRow(person.id);
                        }
                      }}
                    >
                      <td className="border px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 border-2 border-gray-400 rounded-lg"
                          checked={selectedRows.includes(person.id)}
                          onChange={() => handleRowSelection(person.id)}
                        />
                      </td>
                      <td className="border border-gray-400 px-4 py-2 text-center">
                        <button
                          onClick={() => toggleRow(person.id)}
                          className="rounded hover:bg-gray-400"
                        >
                          <span className="text-sm">
                            {isExpanded ? "▲" : "▼"}
                          </span>
                        </button>
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {person.id}
                      </td>
                      <td className="border border-gray-400 px-4 py-2 relative group">
                        {person.firstname} {person.lastname}
                        {/* Tooltip */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100">
                          {person.firstname} {person.lastname}
                        </div>
                      </td>

                      <td className="border border-gray-400 px-4 py-2 relative group">
                        {person.email}
                        {/* Tooltip */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100">
                          {person.email}
                        </div>
                      </td>
                      <td className="border border-gray-400 px-4 py-2 relative group">
                        {person.phone}
                        {/* Tooltip */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100">
                          {person.phone}
                        </div>
                      </td>
                      <td className="border border-gray-400 px-4 py-2 relative group">
                        {person.birthday}
                        {/* Tooltip */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100">
                          {person.birthday}
                        </div>
                      </td>
                      <td className="border border-gray-400 px-4 py-2 relative group">
                        {person.website}
                        {/* Tooltip */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100">
                          {person.website}
                        </div>
                      </td>
                    </tr>
                    {/* 서브 행 */}
                    {expandedRows.includes(person.id) && (
                      <tr>
                        <td
                          colSpan={8}
                          className="border border-gray-400 px-4 py-2 bg-gray-100"
                        >
                          <div>
                            <p className="flex justify-center text-xl font-bold">
                              Address
                            </p>
                            <p>
                              <strong>Street:</strong> {person.address.street}
                            </p>
                            <p>
                              <strong>City:</strong> {person.address.city}
                            </p>
                            <p>
                              <strong>Country:</strong> {person.address.country}
                            </p>
                            <p>
                              <strong>Zipcode:</strong> {person.address.zipcode}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 로딩 중 표시 */}
        {isLoading && (
          <div className="text-center text-xl font-bold mt-6">Loading...</div>
        )}
      </div>
    </>
  );
};

export default App;
