import "./index.css";
import CubeComponent from './components/Cube'
import SphereComponent from "./components/Spehere";
import MapComponent from "./components/Map";


function App(){

  return (
    <>
      <div className='bg-red-500 text-white  text-center p-4'> Hello word</div>
      {/* <CubeComponent /> */}
      {/* <SphereComponent /> */}
      <MapComponent />
    </>
  );
}

export default App;
