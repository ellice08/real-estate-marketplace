import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase.config";
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import ListingItem from "../components/ListingItem";
import homeIcon from "../assets/svg/homeIcon.svg";

function Profile() {
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, "listing");

      const q = query(
        listingsRef,
        where("userRef", "==", auth.currentUser.uid)
        // orderBy("timestamp", "desc")
      );

      const querySnap = await getDocs(q);

      let listing = [];

      querySnap.forEach((doc) => {
        return listing.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      console.log(listing);
      setListing(listing);
      setLoading(false);
    };

    fetchUserListings();
  }, [auth.currentUser.uid]);

  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, { displayName: name });

        const userRef = doc(db, "users", auth.currentUser.uid);

        await updateDoc(userRef, {
          name,
        });
      }
    } catch (error) {
      toast.error("Could not update profile details");
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onDelete = async (listingId) => {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "listing", listingId));
      const updatedListings = listing.filter(
        (listing) => listing.id !== listingId
      );
      setListing(updatedListings);
      toast.success("Successfully deleted listing");
    }
  };
  const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`);

  return (
    <>
      <div className="profile">
        <header className="profileHeader">
          <p className="pageHeader">My Profile</p>
          <button type="button" className="logOut" onClick={onLogout}>
            LogOut
          </button>
        </header>
        <main>
          <div className="profileDetailsHeader">
            <p className="profileDetailsText">Profile details</p>
            <p
              className="changePersonalDetails"
              onClick={() => {
                changeDetails && onSubmit();
                setChangeDetails((prevState) => !prevState);
              }}
            >
              {changeDetails ? "Done" : "Change"}
            </p>
          </div>
          <div className="profileCard">
            <form>
              <input
                type="text"
                id="name"
                className={!changeDetails ? "profileName" : "profileNameActive"}
                disabled={!changeDetails}
                value={name}
                onChange={onChange}
              />{" "}
              <input
                type="text"
                id="email"
                className={
                  !changeDetails ? "profileEmail" : "profileEmailActive"
                }
                disabled
                value={email}
                onChange={onChange}
              />
            </form>
          </div>
          <Link className="createListing" to="/create-listing">
            <img src={homeIcon} alt="Home" />
            <p> Sell or rent your home </p>
            <img src={arrowRight} alt="Arrow right" />
          </Link>

          {!loading && listing?.length > 0 && (
            <>
              <p className="listingText">Your Listings</p>
              <ul className="listingsList">
                {listing.map((listing) => (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                    onDelete={() => onDelete(listing.id)}
                    onEdit={() => onEdit(listing.id)}
                  />
                ))}
              </ul>
            </>
          )}
        </main>
      </div>
    </>
  );
}

export default Profile;
