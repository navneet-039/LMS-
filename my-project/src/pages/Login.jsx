import loginImg from "../assets/Images/login.webp"
import Template from "../components/core/Auth/Template"
 export default function Login(){
  return (
    <Template
    title="Welcome Back"
    description1="Build skills for today,tommorow,and beyond."
    description2="Education to future-proof Your career"
    image={loginImg}
    formType="login"
    />
  )
}