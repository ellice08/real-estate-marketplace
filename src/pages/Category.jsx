import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
import {
  collection,
  getDocs,
  query,
  limit,
  orderBy,
  where,
  startAfter,
} from "firebase/firestore";

function Category() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingRef = collection(db, "listing");
        const q = query(
          listingRef,
          where("type", "==", params.categoryName),
          orderBy("timestamp", "desc"),
          limit(10)
        );

        const querySnap = await getDocs(q);

        let listings = [];

        querySnap.forEach((doc) => {
          return listings.push({ id: doc.id, data: doc.data() });
        });
        setListing(listings);
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error("Could not fetch listings");
      }
    };
    fetchListings();
  }, [listing, params.categoryName]);

  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {" "}
          {params.categoryName === "rent"
            ? "Places for rent"
            : "Places for sale"}
        </p>
      </header>
      {loading ? (
        <Spinner />
      ) : listing && listing.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listing.map((listing) => (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
          </main>
        </>
      ) : (
        <p> No listing for {params.categoryName} </p>
      )}
    </div>
  );
}

export default Category;
