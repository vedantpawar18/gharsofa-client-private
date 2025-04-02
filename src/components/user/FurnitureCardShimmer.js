const FurnitureCardShimmer = () => {
  return (
    <div className="max-sm:mt-5">
      <div className="relative lg:w-auto p-4 bg-gray-100 rounded-md md:w-60 max-sm:w-44">
        {/* Image placeholder */}
        <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden rounded-lg bg-gray-200 animate-pulse" />
        
        {/* Wishlist button placeholder */}
        <div className="absolute top-2 right-2">
          <div className="bg-gray-200 p-2 rounded-full w-8 h-8 animate-pulse" />
        </div>
      </div>

      {/* Content placeholders */}
      <div className="p-2">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            {/* Brand name placeholder */}
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            {/* Product name placeholder */}
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            {/* Price placeholder */}
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
          {/* Room type placeholder */}
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default FurnitureCardShimmer; 