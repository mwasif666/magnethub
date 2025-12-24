import PasswordOtpForm from "@/components/forms/PasswordOtpForm";

const VerifiyOtpArea = () => {
  return (
    <div
      className="tg-login-area pt-130 pb-130 bg-cover bg-center relative"
      style={{
        backgroundImage: `linear-gradient(to right, rgb(0, 0, 0, 0.6), rgb(0, 0, 0, 0.6)),url(/assets/img/banner/banner.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",

        minHeight: "100vh",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-8 col-md-10">
            <div
              className="tg-login-wrapper"
              style={{
                background: "rgba(255,255,255,.08)",
                backdropFilter: "blur(15px)",
                WebkitBackdropFilter: "blur(15px)",
                border: "1px solid rgba(255,255,255,.15)",
                borderRadius: "20px",
                transition: "all .3s ease",
                color: "#fff",
                padding: "30px",

                marginTop: "80px",
              }}
            >
              <div className="tg-login-top text-center mb-30">
                <h2 className="text-white">Verify Your OTP</h2>
                <p> Please enter the OTP sent to your email to reset your password.</p>
              </div>
              <div className="tg-login-form">
                <div className="tg-tour-about-review-form">
                  <PasswordOtpForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifiyOtpArea;
