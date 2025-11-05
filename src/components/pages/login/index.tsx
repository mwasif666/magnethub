import FooterTwo from "@/layouts/footers/FooterTwo"
import LoginArea from "./LoginArea"
import FooterFive from "@/layouts/footers/FooterFive"
import HeaderOne from "@/layouts/headers/HeaderOne"
import HeaderTwo from "@/layouts/headers/HeaderTwo"
import InnerHeader from "@/layouts/headers/InnerHeader"

const Login = () => {
   return (
      <>
         <HeaderOne />
         <main>
            <LoginArea />
         </main>
         <FooterTwo />
      </>
   )
}

export default Login
