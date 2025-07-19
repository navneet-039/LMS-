import React from "react"
import Footer from "../components/common/Footer"
import ContactUsForm from "../components/core/ContactPage/ContactUsForm"
import ContactDetails from "../components/core/ContactPage/ContactDetails"

const Contact=()=>{
  return (
    <div>
    <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">
    <div className="lg:w-[40%]">
      <ContactDetails/>
    </div>
    <div className="lg:w-[60%]">
      <ContactUsForm/>
    </div>
 

    </div>
    <div className="mt-[80px]">
      <Footer/>
    </div>
    
    </div>
  )
}
export default Contact;