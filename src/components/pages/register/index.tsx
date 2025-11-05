import InnerHeader from "@/layouts/headers/InnerHeader"
import RegisterArea from "./RegisterArea"
import FooterFive from "@/layouts/footers/FooterFive"
import FooterTwo from "@/layouts/footers/FooterTwo"
import HeaderOne from "@/layouts/headers/HeaderOne"

const Register = () => {
   return (
      <>
         <HeaderOne />
         <main>
            <RegisterArea />
         </main>
         <FooterTwo />
      </>
   )
}

export default Register
