import FeatureArea from "./FeatureArea"
import BreadCrumb from "@/components/common/BreadCrumb";
import BannerForm from "./BannerForm"
import HeaderOne from "@/layouts/headers/HeaderOne"

const FeatureTwo = () => {
   const breadCrumbsTitle  = 'Let`s explore the listing'
   const crums = 'Listing';
   return (
      <>
         <HeaderOne />
         <main>
        <BreadCrumb title="Listings" sub_title="" />
            <BannerForm />
            <FeatureArea />
         </main>
      </>
   )
}

export default FeatureTwo;
