import { observer } from "mobx-react-lite";
import loaderStore from "../../app/stores/loaderStore";
import React from "react";

const Loader = observer(() => {
  return (
    loaderStore.isLoading && (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
        <div className="loader"></div>
      </div>
    )
  );
});

export default Loader;