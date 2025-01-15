import axios from "axios";
import React, { useEffect, useState } from "react";
import { Person } from "./type";

const App = () => {
  const count = 1000;

  // URL
  const url = process.env.REACT_APP_API_URL;
  const params = process.env.REACT_APP_API_PARAMS;
  const apiUrl = `${url}?_quantity=${count}&${params}`;

  // STATE
  const [gridData, setGridData] = useState<Person[]>([]);

  // EVENT

  const fetchGridData = async () => {
    try {
      const response = await axios.get(apiUrl);

      setGridData(response.data);
      console.log(gridData);
    } catch (err) {
      console.error(err);
    }
  };

  // EFFECT
  useEffect(() => {
    fetchGridData();
  }, []);

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-4">Grid</h1>

        {/* table */}
        <div>
          <table className="bg-black">
            <thead className="bg-slate-300">
              <tr>
                <th className="p-2">
                  <input type="checkbox" />
                </th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </>
  );
};

export default App;
