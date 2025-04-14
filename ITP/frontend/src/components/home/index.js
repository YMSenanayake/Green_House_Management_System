import React, { useState } from "react";
import Navbar from "../header/Navbar";
import first from "./../home/home.jpg";
import AOS from "aos";
import { Link } from "react-router-dom";
import "aos/dist/aos.css";
import axios from "axios";

AOS.init({
  duration: "2500",
});

function Homepage() {
  const FirstSection = () => {
    const [drivercode, setdrivercode] = useState("");
    const [error, seterror] = useState("");

    async function DLogin() {
      const driver = {
        drivercode,
      };
      
      try {
        const result = await axios.post('/api/drivers/dlogin', driver);
        localStorage.setItem('currentdriver', JSON.stringify(result));
        window.location.href = '/j_driverprofile'
        
      } catch (error) {
        console.log(error);
        seterror(true)
      }
      
    }
    
    
    

    return (
      <div>
        <div className="flex flex-col justify-center text-white bg-white ">
          <div
            className="bg-cover  bg-center min-h-screen bg-local"
            style={{ backgroundImage: `url(${first})` }}
          >
            <Navbar />

            <div className="flex overflow-hidden  flex-col items-start px-12 py-20 w-full min-h-screen max-h-screen max-md:px-5 max-md:max-w-full">
              <div
                data-aos="zoom in"
                className="relative mt-20 text-7xl font-semibold tracking-[5.93px] max-md:mt-10 max-md:max-w-full max-md:text-4xl"
              >
                GreenGrow
              </div>
              <div
                data-aos="zoom in"
                className="relative mt-7 text-2xl font-light tracking-[2.00px] max-md:max-w-full"
              >
                Online Green House Management System
              </div>
              <Link to="/c_displayitem">
                <button
                  data-aos="zoom out"
                  className="relative justify-center px-12 py-4 mt-10 text-xl tracking-widest text-center rounded-3xl border-solid bg-white bg-opacity-40 border-neutral-200 max-md:px-5 max-md:my-10"
                >
                  Shop Now
                </button>
              </Link>

              
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SecondSection = () => {
    return (
      <div className="flex flex-col items-center p-10 border border-black border-solid border-opacity-10 bg-neutral-100 max-md:px-5">
        <div
          data-aos="fade-down"
          className="mt-4 text-6xl font-light text-center text-black leading-[67.76px] tracking-[8.37px] max-md:text-4xl"
        >
          ABOUT US
        </div>
        <div className="mt-40 w-full max-w-screen-xl max-md:mt-10 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            <div className="flex flex-col w-[42%] max-md:ml-0 max-md:w-full">
              <div
                data-aos="fade-right"
                className="self-stretch my-auto text-sm font-light tracking-wider text-center text-black max-md:mt-10 max-md:max-w-full"
              >
                At PolyCrop, we're dedicated to revolutionizing agriculture
                through innovation and sustainability. With decades of combined
                experience in polytunnel farming, our passionate team is at the
                forefront of agricultural technology, constantly exploring new
                ways to empower farmers and nurture the planet. Our deep-rooted
                commitment to sustainability drives us to develop advanced
                solutions that not only increase productivity and profitability
                but also promote environmental stewardship.
                <br />
                At PolyCrop, we believe that success in agriculture goes hand in
                hand with sustainability. That's why we're not only focused on
                improving yields and efficiency but also on minimizing
                environmental impact and preserving natural resources for future
                generations. By harnessing the power of innovation and
                sustainability, we're committed to shaping the future of farming
                and creating a healthier, more sustainable world for all.
              </div>
            </div>
            <div className="flex flex-col ml-5 w-[58%] max-md:ml-0 max-md:w-full">
              <img
                data-aos="fade-left"
                loading="lazy"
                srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/4d622133a43ab0cc99e038233d253bab041c7156630571c72a577406aa164c9f?apiKey=81b6a3261fbd4c24a49b94053c58d498&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d622133a43ab0cc99e038233d253bab041c7156630571c72a577406aa164c9f?apiKey=81b6a3261fbd4c24a49b94053c58d498&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d622133a43ab0cc99e038233d253bab041c7156630571c72a577406aa164c9f?apiKey=81b6a3261fbd4c24a49b94053c58d498&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d622133a43ab0cc99e038233d253bab041c7156630571c72a577406aa164c9f?apiKey=81b6a3261fbd4c24a49b94053c58d498&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d622133a43ab0cc99e038233d253bab041c7156630571c72a577406aa164c9f?apiKey=81b6a3261fbd4c24a49b94053c58d498&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d622133a43ab0cc99e038233d253bab041c7156630571c72a577406aa164c9f?apiKey=81b6a3261fbd4c24a49b94053c58d498&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d622133a43ab0cc99e038233d253bab041c7156630571c72a577406aa164c9f?apiKey=81b6a3261fbd4c24a49b94053c58d498&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/4d622133a43ab0cc99e038233d253bab041c7156630571c72a577406aa164c9f?apiKey=81b6a3261fbd4c24a49b94053c58d498&"
                className="grow w-full aspect-[1.49] max-md:mt-9 max-md:max-w-full"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ThirdSection = () => {
    return (
      <div className="flex flex-col p-20 border border-black border-solid border-opacity-10 bg-neutral-100 max-md:px-5">
        <div
          data-aos="fade-down"
          className="self-center mt-4 text-6xl font-light text-center text-black leading-[67.76px] tracking-[8.37px] max-md:max-w-full max-md:text-4xl"
        >
          WHAT WE DO
        </div>
        <div className="self-start mt-44 ml-3.5 max-md:mt-10 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            <div className="flex flex-col w-[58%] max-md:ml-0 max-md:w-full">
              <img
                data-aos="fade-right"
                loading="lazy"
                srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/41367a29364329ed30522bceac0369b8a95152d47683e71734662a06b3a3c067?apiKey=81b6a3261fbd4c24a49b94053c58d498&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/41367a29364329ed30522bceac0369b8a95152d47683e71734662a06b3a3c067?apiKey=81b6a3261fbd4c24a49b94053c58d498&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/41367a29364329ed30522bceac0369b8a95152d47683e71734662a06b3a3c067?apiKey=81b6a3261fbd4c24a49b94053c58d498&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/41367a29364329ed30522bceac0369b8a95152d47683e71734662a06b3a3c067?apiKey=81b6a3261fbd4c24a49b94053c58d498&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/41367a29364329ed30522bceac0369b8a95152d47683e71734662a06b3a3c067?apiKey=81b6a3261fbd4c24a49b94053c58d498&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/41367a29364329ed30522bceac0369b8a95152d47683e71734662a06b3a3c067?apiKey=81b6a3261fbd4c24a49b94053c58d498&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/41367a29364329ed30522bceac0369b8a95152d47683e71734662a06b3a3c067?apiKey=81b6a3261fbd4c24a49b94053c58d498&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/41367a29364329ed30522bceac0369b8a95152d47683e71734662a06b3a3c067?apiKey=81b6a3261fbd4c24a49b94053c58d498&"
                className="grow w-full aspect-[1.49] max-md:mt-10 max-md:max-w-full"
              />
            </div>
            <div className="flex flex-col ml-5 w-[42%] max-md:ml-0 max-md:w-full">
              <div
                data-aos="fade-left"
                className="self-stretch my-auto text-sm font-light tracking-wider text-center text-black max-md:mt-10 max-md:max-w-full"
              >
                At PolyCrop, we're dedicated to revolutionizing agriculture
                through innovation and sustainability. With decades of combined
                experience in polytunnel farming, our passionate team is at the
                forefront of agricultural technology, constantly exploring new
                ways to empower farmers and nurture the planet. Our deep-rooted
                commitment to sustainability drives us to develop advanced
                solutions that not only increase productivity and profitability
                but also promote environmental stewardship.
                <br />
                At PolyCrop, we believe that success in agriculture goes hand in
                hand with sustainability. That's why we're not only focused on
                improving yields and efficiency but also on minimizing
                environmental impact and preserving natural resources for future
                generations. By harnessing the power of innovation and
                sustainability, we're committed to shaping the future of farming
                and creating a healthier, more sustainable world for all.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const FourthSection = () => {
    return (
      <div className="flex flex-col p-20 border border-black border-solid border-opacity-10 bg-neutral-100 max-md:px-5">
        <div
          data-aos="fade-down"
          className="self-center mt-4 text-6xl font-light text-center text-black leading-[67.76px] tracking-[8.37px] max-md:max-w-full max-md:text-4xl"
        >
          CONTACT US
        </div>
        <div className="mt-36 max-md:mt-10 max-md:mr-2 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            <div className="flex flex-col w-[42%] max-md:ml-0 max-md:w-full">
              <div
                data-aos="fade-right"
                className="self-stretch my-auto text-sm font-light tracking-wider text-center text-black max-md:mt-10 max-md:max-w-full"
              >
                At PolyCrop, we're dedicated to revolutionizing agriculture
                through innovation and sustainability. With decades of combined
                experience in polytunnel farming, our passionate team is at the
                forefront of agricultural technology, constantly exploring new
                ways to empower farmers and nurture the planet. Our deep-rooted
                commitment to sustainability drives us to develop advanced
                solutions that not only increase productivity and profitability
                but also promote environmental stewardship.
                <br />
                At PolyCrop, we believe that success in agriculture goes hand in
                hand with sustainability. That's why we're not only focused on
                improving yields and efficiency but also on minimizing
                environmental impact and preserving natural resources for future
                generations. By harnessing the power of innovation and
                sustainability, we're committed to shaping the future of farming
                and creating a healthier, more sustainable world for all.
              </div>
            </div>
            <div className="flex flex-col ml-5 w-[58%] max-md:ml-0 max-md:w-full">
              <img
                data-aos="fade-left"
                loading="lazy"
                srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/9ed1f731261c637d48b32f0a6dc889eed542002b180ca3f89d5703b5ab7c1529?apiKey=81b6a3261fbd4c24a49b94053c58d498&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/9ed1f731261c637d48b32f0a6dc889eed542002b180ca3f89d5703b5ab7c1529?apiKey=81b6a3261fbd4c24a49b94053c58d498&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/9ed1f731261c637d48b32f0a6dc889eed542002b180ca3f89d5703b5ab7c1529?apiKey=81b6a3261fbd4c24a49b94053c58d498&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/9ed1f731261c637d48b32f0a6dc889eed542002b180ca3f89d5703b5ab7c1529?apiKey=81b6a3261fbd4c24a49b94053c58d498&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/9ed1f731261c637d48b32f0a6dc889eed542002b180ca3f89d5703b5ab7c1529?apiKey=81b6a3261fbd4c24a49b94053c58d498&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/9ed1f731261c637d48b32f0a6dc889eed542002b180ca3f89d5703b5ab7c1529?apiKey=81b6a3261fbd4c24a49b94053c58d498&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/9ed1f731261c637d48b32f0a6dc889eed542002b180ca3f89d5703b5ab7c1529?apiKey=81b6a3261fbd4c24a49b94053c58d498&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/9ed1f731261c637d48b32f0a6dc889eed542002b180ca3f89d5703b5ab7c1529?apiKey=81b6a3261fbd4c24a49b94053c58d498&"
                className="grow w-full aspect-[1.49] max-md:mt-10 max-md:max-w-full"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const FifthSection = () => {
    return (
      <div className="flex flex-col items-center px-16 pt-6 pb-20 text-center bg-white leading-[121%] max-md:px-5">
        <div className="flex overflow-hidden relative flex-col justify-center items-center px-16 py-20 w-full max-w-[1191px] min-h-[500px] max-md:px-5 max-md:max-w-full">
          <div className="flex">
            <div
              data-aos="fade-right"
              className=" mr-12 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
            >
              <a href="#">
                <img className="rounded-t-lg" src={first} alt="dddd" />
              </a>
              <div className="p-5">
                <a href="#">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Collaborative Team Dynamics
                  </h5>
                </a>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  Explore how our cohesive team works together seamlessly,
                  leveraging each other's strengths to overcome challenges and
                  deliver exceptional results at every stage of the operation.
                </p>
              </div>
            </div>
            <div
              data-aos="zoom in"
              className="mr-12 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
            >
              <a href="#">
                <img className="rounded-t-lg" src={first} alt="dddd" />
              </a>
              <div className="p-5">
                <a href="#">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Customer Care Excellence
                  </h5>
                </a>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  Discover how we prioritize customer satisfaction through
                  prompt assistance and personalized service, ensuring every
                  customer feels valued and supported.
                </p>
              </div>
            </div>
            <div
              data-aos="fade-left"
              className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
            >
              <a href="#">
                <img className="rounded-t-lg" src={first} alt="dddd" />
              </a>
              <div className="p-5">
                <a href="#">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Efficient Delivery Solutions
                  </h5>
                </a>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  Learn about our streamlined delivery process, which optimizes
                  routes and schedules to guarantee timely transportation of
                  fresh produce from our polytunnels to customers' doorsteps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const FooterSection = () => {
    return (
      <footer className="bg-gray-800 text-white">
        <div className="flex flex-col items-center p-16 max-md:px-5">
          <div 
            data-aos="fade-up"
            className="flex flex-col w-full max-w-screen-xl"
          >
            <div className="flex flex-wrap justify-between gap-12 max-md:flex-col">
              {/* Company Info */}
              <div className="flex flex-col w-1/4 min-w-64 max-md:w-full">
                <div className="text-3xl font-semibold tracking-[3px] mb-6">GreenGrow</div>
                <p className="text-sm font-light tracking-wider mb-6">
                  Leading the revolution in greenhouse management with sustainable solutions and innovative technology.
                </p>
                <div className="flex space-x-4 mt-4">
                  <a href="#" className="p-2 bg-green-600 rounded-full hover:bg-green-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                    </svg>
                  </a>
                  <a href="#" className="p-2 bg-green-600 rounded-full hover:bg-green-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </a>
                  <a href="#" className="p-2 bg-green-600 rounded-full hover:bg-green-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                    </svg>
                  </a>
                </div>
              </div>
              
              {/* Quick Links */}
              <div className="flex flex-col w-1/5 min-w-48 max-md:w-full">
                <h3 className="text-xl font-semibold mb-6 tracking-wider">Quick Links</h3>
                <ul className="space-y-3 text-sm font-light tracking-wider">
                  <li><a href="#" className="hover:text-green-400">Home</a></li>
                  <li><a href="#" className="hover:text-green-400">About Us</a></li>
                  <li><a href="#" className="hover:text-green-400">Services</a></li>
                  <li><a href="#" className="hover:text-green-400">Products</a></li>
                  <li><a href="#" className="hover:text-green-400">Contact</a></li>
                </ul>
              </div>
              
              {/* Services */}
              <div className="flex flex-col w-1/5 min-w-48 max-md:w-full">
                <h3 className="text-xl font-semibold mb-6 tracking-wider">Services</h3>
                <ul className="space-y-3 text-sm font-light tracking-wider">
                  <li><a href="#" className="hover:text-green-400">Greenhouse Setup</a></li>
                  <li><a href="#" className="hover:text-green-400">Crop Management</a></li>
                  <li><a href="#" className="hover:text-green-400">Organic Solutions</a></li>
                  <li><a href="#" className="hover:text-green-400">Consulting</a></li>
                  <li><a href="#" className="hover:text-green-400">Delivery</a></li>
                </ul>
              </div>
              
              {/* Contact Info */}
              <div className="flex flex-col w-1/4 min-w-64 max-md:w-full">
                <h3 className="text-xl font-semibold mb-6 tracking-wider">Contact Us</h3>
                <ul className="space-y-3 text-sm font-light tracking-wider">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    123 Green Street, Farmville, CA 94123
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    GreenGrow@gmail.com
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    +94770081377
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Bottom Copyright */}
            <div className="pt-12 mt-12 border-t border-gray-700 text-center text-sm font-light tracking-wider">
              <p>&copy; {new Date().getFullYear()} GreenGrow. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    );
  };

  return (
    <div>
      <FirstSection />
      <FifthSection />
      <SecondSection />
      <ThirdSection />
      <FourthSection />
      <FooterSection />
    </div>
  );
}

export default Homepage;
