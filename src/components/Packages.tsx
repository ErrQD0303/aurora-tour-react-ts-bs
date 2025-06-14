import { useMemo, type ComponentProps } from "react";
import TourCardList from "./TourCardList";
import tromsoNorwayJpg from "../assets/images/Tromso-Norway.jpg";
import reykjavikIcelandJpg from "../assets/images/Reykjavik-Iceland.jpg";
import yukonCanadaJpg from "../assets/images/Yukon-Canada.jpg";

type Props = ComponentProps<"section"> & {
  onBookingButtonClick?: () => void;
};

export type Tour = {
  id: number;
  place: string;
  currency: string;
  price: string;
  description: string;
  image: string;
};

function Packages({ onBookingButtonClick, ...props }: Props) {
  const tours: Tour[] = useMemo(() => {
    return [
      {
        id: 1,
        place: "Tromso, Norway",
        currency: "$",
        price: "899",
        description:
          "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cumque, mollitia!",
        image: tromsoNorwayJpg,
      },
      {
        id: 2,
        place: "Reykjavik, Iceland",
        currency: "$",
        price: "799",
        description:
          "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cumque, mollitia!",
        image: reykjavikIcelandJpg,
      },
      {
        id: 3,
        place: "Yukon, Canada",
        currency: "$",
        price: "849",
        description:
          "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cumque, mollitia!",
        image: yukonCanadaJpg,
      },
    ];
  }, []);

  return (
    <section className="pt-md-5" {...props}>
      <h2 className="text-center my-5">Packages</h2>

      <TourCardList tours={tours} onBookingButtonClick={onBookingButtonClick} />
    </section>
  );
}

export default Packages;
