import { FC, useEffect } from "react";
import { Link } from "react-router-dom";

const HeroSection: FC = () => {
  useEffect(() => {
    const handleResize = () => {
      const root = document.documentElement;
      root.style.fontSize = window.innerWidth >= 400 ? "16px" : `${window.innerWidth / 400 * 16}px`;
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="bg-[#e3edf6] font-lora">
      <div className="container px-4 grid md:grid-cols-2 py-8 mx-auto">
        <div className="flex items-center">
          <div className="max-w-[450px] space-y-4">
            <p className="text-black">
              Starting At <span className="font-bold">$999</span>
            </p>
            <h2 className="text-black font-bold text-4xl md:text-5xl">
              The best notebook collection 2024
            </h2>
            <h3 className="text-2xl">
              Exclusive offer <span className="text-red-600">-10%</span> off
              this week
            </h3>
            <Link
              to="/product/6"
              data-test="hero-btn"
              className="inline-block bg-white rounded-md px-6 py-3 hover:bg-blue-500 hover:text-white"
            >
              Shop Now
            </Link>
          </div>
        </div>
        <div>
          <img src="/hero.png" alt="hero" className="ml-auto" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;