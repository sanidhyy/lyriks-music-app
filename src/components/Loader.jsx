import { loader } from "../assets";

// Loader
const Loader = ({ title }) => (
  <div className="w-full flex justify-center items-center flex-col">
    {/* loader img */}
    <img src={loader} alt="Loader" className="w-32 h-32 object-contain" />
    {/* loader msg */}
    <h1 className="font-bold text-2xl text-white mt-2">
      {title || "Loading..."}
    </h1>
  </div>
);

export default Loader;
