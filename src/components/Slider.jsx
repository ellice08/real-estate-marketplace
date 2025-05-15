import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase.config";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Spinner from "./Spinner";

function Slider() {
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, "listing");
      const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
      const querySnap = await getDocs(q);

      let listing = [];

      querySnap.forEach((doc) => {
        listing.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListing(listing);
      setLoading(false);
    };

    fetchListings();
  }, []);

  if (loading) return <Spinner />;
  if (!listing || listing.length === 0) return null;

  return (
    <>
      <p className="exploreHeading">Latest Discoveries</p>

      <Swiper
        modules={[Pagination]}
        slidesPerView={1}
        pagination={{ clickable: true }}
      >
        {listing.map(({ data, id }) => (
          <SwiperSlide
            key={id}
            onClick={() => navigate(`/category/${data.type}/${id}`)}
          >
            <div className="swiperSlideDiv" style={{ position: "relative" }}>
              <img
                src={data.imageUrls[0]}
                alt={data.name}
                style={{
                  width: "100%",
                  height: "250px",
                  borderRadius: "10px",
                }}
              />
              <p className="swiperSlideText">{data.name}</p>
              <p className="swiperSlidePrice">
                ₦{" "}
                {(data.discountedPrice != null
                  ? data.discountedPrice
                  : data.regularPrice
                )
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                {data.type === "rent" && "/ month"}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

export default Slider;
