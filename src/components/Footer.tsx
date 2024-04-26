import { FC } from "react";
import { Link } from "react-router-dom";

const Footer: FC = () => (
  <div className="bg-blue-500 text-white p-4 text-center mt-auto">
    <div>2024</div>
    <div>
      <Link
        to="https://github.com/jmsprvt"
        className="hover:underline hover:font-bold opacity-85 hover:opacity-100"
      >
        JMS
      </Link>
    </div>
  </div>
);

export default Footer;
