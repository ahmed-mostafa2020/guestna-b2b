// import { useDispatch, useSelector } from "react-redux";
// import { setFavorites } from "@store/favorites/favoritesSlice";

import { memo, useMemo } from "react";

import TripsCard from "@components/ui/trips/TripsCard";

const MyFavoritesTrips = ({ data }) => {
  // const favorites = useSelector((state) => state.favorites.serverItems);

  // const favorites = data?.nodes;

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(setFavorites(favorites));
  // }, [dispatch]);

  const renderedFavoritesTrips = useMemo(() => {
    return data?.nodes?.map((trip) => (
      <div key={trip._id} className="flex-1">
        <TripsCard
          activityCard={trip}
          imageWidth={420}
          newDesign={true}
          oneSize={true}
        />
      </div>
    ));
  }, [data]);

  return (
    <section className="grid grid-cols-1 gap-x-2 gap-y-9 md:grid-cols-3">
      {renderedFavoritesTrips}
    </section>
  );
};

export default memo(MyFavoritesTrips);
