import React from 'react'
import { Link } from 'react-router-dom';
import loginMainImage from '../../assets/images/loginMainImage.jpg'

const LoginRegisterLeftImg = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gray-200 items-center justify-center">
        <div className="relative w-full h-full">
          <img
            src= {loginMainImage}
            alt="GharSofa shoe"
            className="object-cover w-full h-full"
          />
          <div className="absolute top-8 left-8 text-white font-bold">
           <Link to="/"><p> &gt; HOME</p></Link> 
          </div>
        </div>
      </div>
  )
}

export default LoginRegisterLeftImg