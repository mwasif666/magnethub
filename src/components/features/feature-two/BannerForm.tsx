import BannerFormOne from "@/components/common/banner-form/BannerFormOne";

type BannerFormProps = {
  setListing: React.Dispatch<React.SetStateAction<any[]>>;
  setPagination: React.Dispatch<React.SetStateAction<any[]>>;
};

const BannerForm = ({ setListing, setPagination }: BannerFormProps) => {
  return (
    <div className="tg-booking-form-area tg-booking-form-grid-space pb-50">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            {/* <div className="tg-booking-form-item tg-booking-form-grid"> */}
               <BannerFormOne setListing={setListing} setPagination={setPagination}/>
              {/* <BannerFormTwo setListing={setListing} /> */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerForm;
