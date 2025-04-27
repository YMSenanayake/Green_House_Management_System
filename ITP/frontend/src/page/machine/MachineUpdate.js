import React, { useState, useEffect } from "react";
import axios from "axios";
import Adminnavbar from "./Component/Adminnavbar";
import Swal from "sweetalert2";
import Loader from "../../components/header/Loader";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MachineUpdate = () => {
  const { mid } = useParams();

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [parts, setParts] = useState("");
  const [discription, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [lastRepairDate, setLastRepairDate] = useState(new Date());
  const [repairTimePeriod, setperiod] = useState('');

  useEffect(() => {
    async function getMachine() {
      try {
        setLoading(true);
        const response = (await axios.get(`http://localhost:3000/api/machines/getMachine/${mid}`)).data;
        console.log(response.machine);
        setId(response.machine._id);
        setName(response.machine.name);
        setCost(response.machine.cost);
        setParts(response.machine.parts);
        setDescription(response.machine.discription);
        setLocation(response.machine.location);
        setLastRepairDate(response.machine.lastRepairDate);
        setperiod(response.machine.repairTimePeriod);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    }
    getMachine();
  }, [mid]);

  const updateMachine = async (e) => {
    e.preventDefault();
    const updatedMachine = {
      name,
      cost,
      parts,
      discription,
      location,
      lastRepairDate,
      repairTimePeriod,
    };
    try {
      setLoading(true);
      await axios.put(`http://localhost:3000/api/machines/updateMachine/${mid}`, updatedMachine);
      setLoading(false);
      Swal.fire("Success", "Machine updated successfully", "success").then(() => {
        window.location.href = "/m_machine";
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
      Swal.fire("Error", "Failed to update machine", "error");
    }
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-green-50 min-h-screen">
          <div className="flex">
            <Adminnavbar />
            <div className="flex flex-col px-8 py-12 justify-center w-full" style={{ zIndex: 900 }}>
              <h1 className="text-3xl font-bold text-green-700 mb-8 text-center">Update Machine</h1>
              <form onSubmit={updateMachine} className="bg-white shadow-xl rounded-2xl px-12 py-10 space-y-6">
                
                <div className="mb-5">
                  <label htmlFor="name" className="mb-2 block text-lg font-semibold text-green-800">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      const lettersOnly = e.target.value.replace(/[^A-Za-z\s]/g, "");
                      setName(lettersOnly);
                    }}
                    className="w-full rounded-lg border border-green-200 bg-green-50 focus:ring-2 focus:ring-green-400 py-3 px-6 text-base text-gray-700"
                    required
                  />

                </div>

                <div className="mb-5">
                  <label htmlFor="cost" className="mb-2 block text-lg font-semibold text-green-800">
                    Cost
                  </label>
                  <input
                    type="text"
                    value={cost}
                    onChange={(e) => {
                      const numbersOnly = e.target.value.replace(/[^0-9]/g, "");
                      setCost(numbersOnly);
                    }}
                    className="w-full rounded-lg border border-green-200 bg-green-50 focus:ring-2 focus:ring-green-400 py-3 px-6 text-base text-gray-700"
                    required
                  />

                </div>

                <div className="mb-5">
                  <label htmlFor="parts" className="mb-2 block text-lg font-semibold text-green-800">
                    Parts
                  </label>
                  <input
                    type="text"
                    value={parts}
                    onChange={(e) => setParts(e.target.value)}
                    className="w-full rounded-lg border border-green-200 bg-green-50 focus:ring-2 focus:ring-green-400 py-3 px-6 text-base text-gray-700"
                    required
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="description" className="mb-2 block text-lg font-semibold text-green-800">
                    Description
                  </label>
                  <input
                    type="text"
                    value={discription}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-lg border border-green-200 bg-green-50 focus:ring-2 focus:ring-green-400 py-3 px-6 text-base text-gray-700"
                    required
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="location" className="mb-2 block text-lg font-semibold text-green-800">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-lg border border-green-200 bg-green-50 focus:ring-2 focus:ring-green-400 py-3 px-6 text-base text-gray-700"
                    required
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="lastRepairDate" className="mb-2 block text-lg font-semibold text-green-800">
                    Last Repair Date
                  </label>
                  <DatePicker
                      selected={lastRepairDate}
                      onChange={(date) => setLastRepairDate(date)}
                      dateFormat="dd/MM/yyyy"
                      maxDate={new Date()} // No future dates
                      minDate={new Date("2023-01-01")} // No dates before Jan 1, 2023
                      className="w-full rounded-lg border border-green-200 bg-green-50 focus:ring-2 focus:ring-green-400 py-3 px-6 text-base text-gray-700"
                    />


                </div>

                <div className="mb-5">
                  <label htmlFor="repairTimePeriod" className="mb-2 block text-lg font-semibold text-green-800">
                    Repair Time Period
                  </label>
                  <input
                    type="text"
                    placeholder="Repair time period"
                    value={repairTimePeriod}
                    onChange={(e) => setperiod(e.target.value)}
                    className="w-full rounded-lg border border-green-200 bg-green-50 focus:ring-2 focus:ring-green-400 py-3 px-6 text-base text-gray-700"
                    required
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="mt-6 p-3 md:w-96 text-white bg-green-500 hover:bg-green-600 font-semibold text-lg rounded-full transition-transform duration-300 ease-in-out transform hover:scale-110 shadow-md"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MachineUpdate;
