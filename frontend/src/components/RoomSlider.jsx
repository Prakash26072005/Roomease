import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function RoomSlider({ images }) {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    arrows: true,
  };

  return (
    <Slider {...settings}>
      {images.map((img, i) => {
        const src = typeof img === "string" ? img : img.url;  // handle both

        return (
          <div key={i}>
            <img
              src={src}
              style={{
                width: "100%",
                height: "320px",
                objectFit: "cover",
              }}
            />
          </div>
        );
      })}
    </Slider>
  );
}
