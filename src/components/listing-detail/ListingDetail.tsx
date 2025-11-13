import Wishlist from "@/svg/home-one/Wishlist";
import Image from "next/image";
import React from "react";

interface ListingDetailProps {
  url: string;
  id: string;
}

const ListingDetail: React.FC<ListingDetailProps> = ({ url, id }) => {
  return (
    <>
      <div className="card">
        <div>
          <h1>Nightclub Bar</h1>
          <h4>
            <span>Hosted By:</span>Waleed Ghori
          </h4>
        </div>
        <div>
          <Wishlist />
          <h3>Add To Favorite</h3>
        </div>
      </div>
      <div className="card mt-2">
        <Image
          className="tg-card-border w-100"
          src={`http://magnatehub.au/uploads/project/card`}
          alt={"Project listing image"}
          width={400}
          height={300}
          unoptimized
          onError={(e) => {
            e.currentTarget.src =
              "http://magnatehub.au/uploads/project/card/67-1759918312-87531328.jpg";
          }}
        />
      </div>

      <div className="card mt-2">
        <div>
            <div>
                <div>
                    {/* <icon>Location</icon> */}
                    <h2>Locations</h2>
                </div>
                <h6>Victoria-VIC</h6>
            </div>
            <div>
                <div>
                    {/* <icon>Location</icon> */}
                    <h2>Category</h2>
                </div>
                <h6>Age Care Retirment</h6>
            </div>
            <div>
                <div>
                    {/* <icon>Location</icon> */}
                    <h2>Price</h2>
                </div>
                <h6>45000</h6>
            </div>
            <div>
                <div>
                    {/* <icon>Location</icon> */}
                    <h2>Yearly Trading</h2>
                </div>
                <h6>12</h6>
            </div>
            <div>
                <div>
                    {/* <icon>Location</icon> */}
                    <h2>Earning Type</h2>
                </div>
                <h6>EBIDA</h6>
            </div>
            <div>
                <div>
                    {/* <icon>Location</icon> */}
                    <h2>Stock Level</h2>
                </div>
                <h6>20000</h6>
            </div>
        </div>

        <div className="card mt-2">
          <h2>Summary</h2>
          <p>8:15 - 8:45pm - dinner buffet service 8:50 - 8:55pm - Sahu parents speech 9:00 - 9:05 - Ranasinghe parents speech 9:10 - 9:20 - Bride + groom speech 9:20 - 9:30 - cake + first dance 9:30 - 10:00pm - dance floor open 10:00 - 10:15 - guests to move into after party 10:15 onwards - dance floor open</p>
        </div>
         <div className="card mt-2">
          <h2>Skills</h2>
          <p>8:15 - 8:45pm - dinner buffet service 8:50 - 8:55pm - Sahu parents speech 9:00 - 9:05 - Ranasinghe parents speech 9:10 - 9:20 - Bride + groom speech 9:20 - 9:30 - cake + first dance 9:30 - 10:00pm - dance floor open 10:00 - 10:15 - guests to move into after party 10:15 onwards - dance floor open</p>
        </div>
         <div className="card mt-2">
          <h2>Potential</h2>
          <p>8:15 - 8:45pm - dinner buffet service 8:50 - 8:55pm - Sahu parents speech 9:00 - 9:05 - Ranasinghe parents speech 9:10 - 9:20 - Bride + groom speech 9:20 - 9:30 - cake + first dance 9:30 - 10:00pm - dance floor open 10:00 - 10:15 - guests to move into after party 10:15 onwards - dance floor open</p>
        </div>
         <div className="card mt-2">
          <h2>Hours</h2>
          <p>8:15 - 8:45pm - dinner buffet service 8:50 - 8:55pm - Sahu parents speech 9:00 - 9:05 - Ranasinghe parents speech 9:10 - 9:20 - Bride + groom speech 9:20 - 9:30 - cake + first dance 9:30 - 10:00pm - dance floor open 10:00 - 10:15 - guests to move into after party 10:15 onwards - dance floor open</p>
        </div>
         <div className="card mt-2">
          <h2>Staff</h2>
          <p>8:15 - 8:45pm - dinner buffet service 8:50 - 8:55pm - Sahu parents speech 9:00 - 9:05 - Ranasinghe parents speech 9:10 - 9:20 - Bride + groom speech 9:20 - 9:30 - cake + first dance 9:30 - 10:00pm - dance floor open 10:00 - 10:15 - guests to move into after party 10:15 onwards - dance floor open</p>
        </div>
         <div className="card mt-2">
          <h2>Lease</h2>
          <p>8:15 - 8:45pm - dinner buffet service 8:50 - 8:55pm - Sahu parents speech 9:00 - 9:05 - Ranasinghe parents speech 9:10 - 9:20 - Bride + groom speech 9:20 - 9:30 - cake + first dance 9:30 - 10:00pm - dance floor open 10:00 - 10:15 - guests to move into after party 10:15 onwards - dance floor open</p>
        </div>
         <div className="card mt-2">
          <h2>Business</h2>
          <p>8:15 - 8:45pm - dinner buffet service 8:50 - 8:55pm - Sahu parents speech 9:00 - 9:05 - Ranasinghe parents speech 9:10 - 9:20 - Bride + groom speech 9:20 - 9:30 - cake + first dance 9:30 - 10:00pm - dance floor open 10:00 - 10:15 - guests to move into after party 10:15 onwards - dance floor open</p>
        </div>
         <div className="card mt-2">
          <h2>Training</h2>
          <p>8:15 - 8:45pm - dinner buffet service 8:50 - 8:55pm - Sahu parents speech 9:00 - 9:05 - Ranasinghe parents speech 9:10 - 9:20 - Bride + groom speech 9:20 - 9:30 - cake + first dance 9:30 - 10:00pm - dance floor open 10:00 - 10:15 - guests to move into after party 10:15 onwards - dance floor open</p>
        </div>
           <div className="card mt-2">
          <h2>Awards</h2>
          <p>8:15 - 8:45pm - dinner buffet service 8:50 - 8:55pm - Sahu parents speech 9:00 - 9:05 - Ranasinghe parents speech 9:10 - 9:20 - Bride + groom speech 9:20 - 9:30 - cake + first dance 9:30 - 10:00pm - dance floor open 10:00 - 10:15 - guests to move into after party 10:15 onwards - dance floor open</p>
        </div>
           <div className="card mt-2">
          <h2>Selling Reason</h2>
          <p>8:15 - 8:45pm - dinner buffet service 8:50 - 8:55pm - Sahu parents speech 9:00 - 9:05 - Ranasinghe parents speech 9:10 - 9:20 - Bride + groom speech 9:20 - 9:30 - cake + first dance 9:30 - 10:00pm - dance floor open 10:00 - 10:15 - guests to move into after party 10:15 onwards - dance floor open</p>
        </div>
      </div>
    </>
  );
};

export default ListingDetail;
