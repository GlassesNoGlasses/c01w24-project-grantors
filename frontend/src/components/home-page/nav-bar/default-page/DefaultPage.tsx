import React from 'react'
import { Link } from 'react-router-dom'
import happy_person from '../../../../images/happy_person.png'
import grant_signing from '../../../../images/grant_signing.png'

const DefaultPage = () => {
  const CreateAccountButton = () => {
    return (
      <Link className='p-2 px-5 m-2 bg-green-500 hover:bg-green-600 active:bg-green-700
        text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
        text-lg'
        to='/signup'>
        Create Account
      </Link>
    )
  }
  
  const DiscoverServicesButton = () => {
    return (
      <Link className='p-2 px-5 m-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700
        text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
        text-lg'
        to='/services'>
        Discover Our Services
      </Link>
    )
  }
  
  const ViewGrantsButton = () => {
    return (
      <Link className='p-2 px-5 m-2 bg-purple-500 hover:bg-purple-600 active:bg-purple-700
        text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
        text-lg'
        to='/grants'>
        View Grants
      </Link>
    )
  }
  
  return (
    <div className='flex justify-center'>
      <div className='flex flex-col py-2 lg:w-1/2'>
        <div className='flex flex-col gap-8 m-2 p-6 rounded-lg text-center
          bg-green-100 hover:shadow-md transition-shadow duration-150 ease-in'>
          <h2 className='flex flex-row justify-center text-4xl font-bold'>Bridging Opportunities, Breaking Barriers</h2>
          <div className='flex justify-center'>
            <img className='rounded-lg sm:w-1/2' 
              src={happy_person}
              alt='Happy Person' />
          </div>
          <p className='text-base flex flex-row justify-center'>
            Welcome to Grantors, where accessibility meets opportunity. Our innovative web app is your one-stop destination for discovering, applying, and managing grants. Whether you're a passionate individual seeking funding for your projects or a forward-thinking organization looking to support impactful initiatives, Grantors provides an inclusive platform tailored to your needs. Explore, connect, and make a difference with ease – it's time to turn your aspirations into reality with Grantors.
          </p>
          <div className='text-base flex justify-center'>
            <CreateAccountButton />
          </div>
        </div>
        <div className='flex flex-col gap-8 m-2 p-6 rounded-lg text-center
          bg-blue-100 hover:shadow-md transition-shadow duration-150 ease-in'>
          <h2 className='flex flex-row justify-center text-3xl font-bold'>One Stop Shop</h2>
          <p className='text-base flex flex-row justify-center'>
            We understand the challenges individuals and organizations face when navigating the complex world of grants. Our platform is designed to be your ultimate solution – a comprehensive, all-in-one hub where you can effortlessly access everything you need for your grant journey.
          </p>
          <div className='grid grid-cols-2'>
            <h3 className='text-2xl font-semibold'>Grant Seekers</h3>
            <h3 className='text-2xl font-semibold'>Grant Providers</h3>
            <div className='flex justify-center'>
              <ul className='list-disc text-left text-xl'>
                <li>Discovering</li>
                <li>Applying</li>
                <li>Fulfilling</li>
              </ul>
            </div>
            <div className='flex justify-center'>
              <ul className='list-disc text-left text-xl'>
                <li>Creating</li>
                <li>Tracking</li>
                <li>Managing</li>
              </ul>
            </div>
          </div>
          <div className='flex justify-center'>
            <img className='rounded-lg sm:w-1/2' 
              src={grant_signing}
              alt='Grant being signed' />
          </div>
          <p className='text-base flex flex-row justify-center'>
            Whether you're a grant seeker or a grant provider, Grantors offers unmatched convenience, accessibility, and efficiency at every step of the journey. Join us today and experience the difference of a truly inclusive and empowering grant platform.
          </p>
          <div className='text-base flex justify-center'>
            <DiscoverServicesButton />
          </div>
        </div>
        <div className='flex flex-col gap-8 m-2 p-6 rounded-lg text-center
          bg-orange-100 hover:shadow-md transition-shadow duration-150 ease-in'>
          <h2 className='flex flex-row justify-center text-3xl font-bold'>Accessibility First</h2>
          <p className='text-base flex flex-row justify-center'>
            At Grantors, accessibility isn't just a feature – it's a fundamental principle that shapes everything we do. We're committed to ensuring that our platform is inclusive and accessible to all users, regardless of their abilities or limitations.
          </p>
          <p className='text-base flex flex-row justify-center'>
            Accessibility isn't an afterthought – it's a core value that drives our design, development, and user experience decisions. We're dedicated to creating a platform where everyone can fully participate, contribute, and thrive.
          </p>
        </div>
        <div className='flex flex-col gap-8 m-2 p-6 rounded-lg text-center
         bg-purple-100 hover:shadow-md transition-shadow duration-150 ease-in'>
          <h2 className='flex flex-row justify-center text-3xl font-bold'>World Renowned System</h2>
          <p className='text-base flex flex-row justify-center'>
            We take pride in curating a vast array of grant opportunities from some of the most reputable and esteemed grant providers in the industry. Our platform offers access to a diverse range of funding opportunities, ensuring that users can discover grants that align with their unique goals, interests, and initiatives.
          </p>
          <p className='text-base flex flex-row justify-center'>
            We partner with leading grant providers who share our commitment to making a positive impact in communities around the world. From government agencies and non-profit organizations to corporations and foundations, our network of grant providers spans across various sectors and causes, offering a wealth of opportunities for individuals and organizations alike.
          </p>
          <p className='text-base flex flex-row justify-center'>
            Whether you're passionate about environmental conservation, social justice, education, arts and culture, or any other area of interest, you'll find a multitude of grant opportunities to explore on Grantors. Our platform provides comprehensive details about each grant, including eligibility criteria, funding amounts, application deadlines, and more, empowering users to make informed decisions about where to direct their efforts.
          </p>
          <p className='text-base flex flex-row justify-center'>
            With Grantors, you can rest assured that you're accessing high-quality grant opportunities from trusted providers who are dedicated to driving positive change in the world. Join us today and unlock a world of possibilities to turn your vision into reality.
          </p>
          <div className='text-base flex justify-center'>
            <ViewGrantsButton />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DefaultPage