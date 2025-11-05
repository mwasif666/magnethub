"use client"
import Link from "next/link"
import { useState } from "react"

const RegisterForm = () => {

   const [activeTab, setActiveTab] = useState("seller")

   const tabs = [
      { id: "seller", label: "Seller" },
      { id: "buyer", label: "Buyer" },
      { id: "capital", label: "Capital Raiser" },
      { id: "brokers + Franchisers", label: "Brokers + Franchisers" },
   ]

   return (
      <>
         <div className="d-flex gap-2 justify-content-center mb-4 flex-wrap">
            {tabs.map(tab => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="tab-btn"
                  style={{
                     padding: "10px 18px",
                     borderRadius: "8px",
                     border: "1px solid #ccc",
                     background: activeTab === tab.id ? "linear-gradient(90deg,#6A14DA,#316FF6)" : "#F1F1F1",
                     color: activeTab === tab.id ? "#fff" : "#333",
                     fontWeight: "600",
                     cursor: "pointer",
                     fontSize: "14px"
                  }}
               >
                  {tab.label}
               </button>
            ))}
         </div>

         <form onSubmit={(e) => e.preventDefault()}>
            <div className="row">
               <div className="col-lg-6 mb-25">
                  <input className="input" type="text" placeholder="First Name" />
               </div>
               <div className="col-lg-6 mb-25">
                  <input className="input" type="text" placeholder="Last Name" />
               </div>
               <div className="col-lg-12 mb-25">
                  <input className="input" type="email" placeholder="Example@gmail.com" />
               </div>
               <div className="col-lg-12 mb-25">
                  <input className="input" type="password" placeholder="Password" />
               </div>
               <div className="col-lg-12 mb-25">
                  <input className="input" type="password" placeholder="Re-type Password" />
               </div>

               <div className="col-lg-12">
                  <div className="d-flex align-items-center justify-content-between">
                     <div className="review-checkbox d-flex align-items-center mb-25">
                        <label htmlFor="australia" className="tg-label">Already Have An Account?</label>
                     </div>
                     <div className="tg-login-navigate mb-25">
                        <Link href="/login">Log In</Link>
                     </div>
                  </div>
                  <button type="submit" className="tg-btn w-100">Register</button>
               </div>
            </div>
         </form>
      </>
   )
}

export default RegisterForm
