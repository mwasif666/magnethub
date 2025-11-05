import RegisterForm from "@/components/forms/RegisterForm"

const RegisterArea = () => {
   return (
      <div
         className="tg-login-area pt-130 pb-130 bg-cover bg-center relative"
         style={{
          backgroundImage: `
           linear-gradient(rgba(40, 0, 120, 0.4), rgba(40, 0, 120, 0.4)),
           url('/assets/img/banner/banner.png')
              `,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              minHeight: "100vh"
                                             }}>
         <div className="container">
            <div className="row justify-content-center">
               <div className="col-xl-6 col-lg-8 col-md-10">
                    <div className="tg-login-wrapper" style={{
                      background: "#fff",
                      borderRadius: "12px",
                      padding: "30px",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                      marginTop: "80px"
                    }}>
                     <div className="tg-login-top text-center mb-30">
                        <h2>Register Now!</h2>
                        <p>Welcome to Magnate Hub your first step to success</p>
                     </div>
                     <div className="tg-login-form">
                        <div className="tg-tour-about-review-form">
                           <RegisterForm />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default RegisterArea
