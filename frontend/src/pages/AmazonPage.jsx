import React from "react";

const AmazonPage = () => {
  return (
    <main className="dark:bg-gray-100 bg-white relative overflow-hidden h-screen">
      <header className="h-24 sm:h-32 flex items-center z-30 w-full">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="uppercase text-gray-800 dark:text-white font-black text-3xl">
            AMAZON
          </div>
        </div>
      </header>
      <div className="bg-white dark:bg-gray-800 flex relative z-20 items-center overflow-hidden">
        <div className="container mx-auto px-6 flex relative py-50">
        <div className="hidden sm:block sm:w-1/2 lg:w-3/4 relative">
  <img
    src="https://t3.ftcdn.net/jpg/02/71/77/56/360_F_271775672_yo8ZgraN2IHGbfqP2k0PsLjwvmatUNUJ.jpg"
    className="w-300 h-300 object-cover m-auto"
    alt="Watch"
  />
</div>
          
  

 

        </div>
        <div className="sm:w-2/3 lg:w-2/5 flex flex-col relative z-20">
            
            <h1 className="font-bebas-neue uppercase text-6xl sm:text-8xl font-black flex flex-col leading-none dark:text-white text-gray-800">
            Happy shopping!
              <span className="text-5xl sm:text-7xl">Time</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-700 dark:text-white">
            Discover your next favorite item right here.
             Whether you're upgrading your wardrobe, enhancing your home decor, or finding the perfect gift, we've got you covered. Browse our curated collections and enjoy a seamless shopping experience from the comfort of your home.


            </p>
          </div>
        
      </div>
    </main>
  );
};

export default AmazonPage;
