import Link from "next/link";
import ContactForm from "../forms/ContactForm";

const ContactArea = () => {
  return (
    <div className="tg-contact-area pt-130 p-relative z-index-1 pb-100">
      <div className="container">
        <div className="row align-items-center">
          {/* Left Section - Contact Info */}
          <div className="col-lg-5">
            <div className="tg-team-details-contant tg-contact-info-wrap mb-30">
              <h6 className="mb-15">Contact Information</h6>
              <p className="mb-25">
                Welcome to Magnate Hub — your trusted marketplace for buying,
                selling, and investing in businesses. Whether you’re an
                entrepreneur, investor, or broker, we’re here to help you make
                meaningful business connections and unlock new growth
                opportunities.
              </p>
              <div className="tg-team-details-contact-info mb-35">
                <div className="tg-team-details-contact">
                  <div className="item">
                    <span>Phone :</span>
                    <Link href="tel:+61300000000">+61 3 0000 0000</Link>
                  </div>

                  <div className="item">
                    <span>E-mail :</span>
                    <Link href="mailto:info@magnatehub.au">
                      info@magnatehub.au
                    </Link>
                  </div>
                  <div className="item">
                    <span>Address :</span>
                    <Link href="#">Melbourne, Australia</Link>
                  </div>
                </div>
              </div>

              <div className="tg-contact-map h-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31513469.254011944!2d113.33895365032925!3d-25.73496854357832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f27b8b15%3A0x5045675218ceed30!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sau!4v1730945742000!5m2!1sen!2sau"
                  width="600"
                  height="450"
                  style={{ border: "0" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Right Section - Contact Form */}
          <div className="col-lg-7">
            <div className="tg-contact-content-wrap ml-40 mb-30">
              <h3 className="tg-contact-title mb-15">
                Let’s Connect and Grow Together
              </h3>
              <p className="mb-30">
                Have a question or want to explore partnership opportunities?
                Fill out the form below and our team will get back to you
                shortly. At Magnate Hub, we value strong connections and
                transparent communication.
              </p>
              <div className="tg-contact-form tg-tour-about-review-form">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactArea;
