import axios from "axios";
import React, { useEffect, useState } from "react";
import { Person } from "./type";

const App = () => {
  const count = 100;

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
  return <div>grid</div>;
};

export default App;
