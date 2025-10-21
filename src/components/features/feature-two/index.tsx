import FeatureArea from "./FeatureArea"
import BreadCrumb from "./BreadCrumb"
import BannerForm from "./BannerForm"
import HeaderOne from "@/layouts/headers/HeaderOne"

const FeatureTwo = () => {
   let breadCrumbsTitle  = 'Let`s explore the listing'
   let crums = 'Listing';
   return (
      <>
         <HeaderOne />
         <main>
            <BreadCrumb breadCrumbsTitle={breadCrumbsTitle} crums={crums}/>
            <BannerForm />
            <FeatureArea />
         </main>
      </>
   )
}

export default FeatureTwo
