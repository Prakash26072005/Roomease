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
      {images.map((img, i) => (
        <div key={i}>
          <img
            src={img}
            style={{
              width: "100%",
              height: "320px",
              objectFit: "cover"
            }}
          />
        </div>
      ))}
    </Slider>
  );
}
