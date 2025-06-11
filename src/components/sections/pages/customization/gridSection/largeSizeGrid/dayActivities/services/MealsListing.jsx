import Image from "next/image";

import { useDispatch, useSelector } from "react-redux";
import {
  addOrIncrementMeal,
  decreaseMeal,
} from "@store/services/servicesSlice";

import { memo } from "react";

import formatCurrency from "@utils/FormatCurrency";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const MealsListing = ({ list }) => {
  const meals = useSelector((state) => state.servicesData.meals);
  const dispatch = useDispatch();

  const renderedMeals = list.map((meal, index) => {
    // Find the meal in the Redux state
    const mealInState = meals.find((m) => m.service === meal._id);
    const mealQuantity = mealInState ? mealInState.quantity : 0;

    return (
      <div
        key={meal._id}
        className={`flex flex-col gap-3 py-5 ${
          index !== list?.length - 1 && "border-b border-border"
        }`}
      >
        <div className="flex items-center gap-1">
          <Image
            src={meal.icon}
            alt={meal.name}
            width={32}
            height={32}
            className="object-contain w-8 h-8"
          />
          <h4 className="font-light">{meal.name}</h4>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                dispatch(
                  addOrIncrementMeal({ mealId: meal._id, price: meal.price })
                )
              }
              className="w-4 h-4 p-3 border border-black rounded-md centered"
            >
              <AddIcon />
            </button>

            <span className="w-4 text-xl text-center transition-all duration-200 ease-in-out">
              {mealQuantity}
            </span>

            <button
              onClick={() => dispatch(decreaseMeal(meal._id))}
              className="w-4 h-4 p-3 border border-black rounded-md centered disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={mealQuantity === 0}
            >
              <RemoveIcon />
            </button>
          </div>

          <p className="font-light">{formatCurrency(meal.price)}</p>
        </div>
      </div>
    );
  });

  return renderedMeals;
};

export default memo(MealsListing);
