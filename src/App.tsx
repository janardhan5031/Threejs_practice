import "./index.css";
import CubeComponent from './components/Cube'
import SphereComponent from "./components/Spehere";


function App(){

  return (
    <>
      <div className='bg-red-500 text-white  text-center p-4'> Hello word</div>
      {/* <CubeComponent /> */}
      <SphereComponent />
    </>
  );
}

export default App;
