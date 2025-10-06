import React, { useEffect, useState } from "react";

const ItemCard = ({
  imageList,
  name,
  pax,
  recommendedfor,
  inclusion,
  price,
}) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!imageList || imageList.length === 0) return;

    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % imageList.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [imageList]);

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col w-[300px] border border-gray-300 shadow-sm">
      {/* Carousel Container */}
      <div className="relative w-full h-[200px] overflow-hidden rounded-t-2xl carousel">
        {imageList?.map((image, index) => (
          <img
            src={image.url}
            alt={`${name} image ${index + 1}`}
            key={index}
            className={`absolute top-0 left-0 w-full h-[300px] object-cover transition-opacity duration-500
            ${
              index === active ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          />
        ))}

        <span className="absolute left-2 top-2 z-10 py-1 bg-blue-600 rounded px-2 text-[12px] text-white">
          Available
        </span>

        {/* Dots indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex z-10">
          {imageList.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full border border-white mr-1
              ${index === active ? "bg-white" : "bg-transparent"}`}
            ></div>
          ))}
        </div>
      </div>

      {/* Content below the carousel */}
      <div className="p-4 flex flex-col gap-2">
        <p className="font-semibold text-lg">{name}</p>
        <div className=" gap-2 text-sm text-gray-700">
          <div className="flex justify-between pb-2">
            <span>Recommened for:</span>
            <span>{pax}</span>
          </div>
          <div className="max-w-full overflow-x-auto overflow-y-hidden flex space-x-2 py-1 no-scrollbar">
            {recommendedfor.map((event, index) => (
              <span
                key={index}
                className="bg-gray-200 rounded px-2 py-0.5 whitespace-nowrap"
              >
                {event}
              </span>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-600">{inclusion}</p>
        <div className="flex justify-between items-center mt-2">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Starts from</span>
            <span className="font-bold text-lg">₱ {price}</span>
          </div>
          <button className="rounded-2xl bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
