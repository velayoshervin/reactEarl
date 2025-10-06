import "./SignUp.css";
import { React, useState, useRef, useEffect } from "react";
import { createUser } from "../../ItemsAxios";
import TokenPage from "../Login/TokenPage";
import { useNavigate } from "react-router-dom";

const termsData = {
  title: "Terms & Conditions",
  updatedAt: "August 3, 2025",
  items: [
    {
      heading: "Account Responsibility",
      body: "You are responsible for maintaining the confidentiality of your account information, including your email and password.",
    },
    {
      heading: "Use of Services",
      body: "You agree to use the website only for lawful purposes and in a way that does not infringe the rights of others.",
    },
    {
      heading: "Privacy",
      body: "We collect and store your personal data in accordance with our Privacy Policy. Your information will never be sold or shared without consent.",
    },
    {
      heading: "Intellectual Property",
      body: "All content on this website is the property of [Your Company Name] and may not be copied or reused without permission.",
    },
    {
      heading: "Termination",
      body: "We reserve the right to suspend or terminate accounts that violate our terms or engage in harmful behavior.",
    },
    {
      heading: "Changes",
      body: "We may update these terms from time to time. Continued use of the service constitutes acceptance of the updated terms.",
    },
  ],
};

const images = [
  {
    url: "https://hips.hearstapps.com/hmg-prod/images/wedding-wishes-bride-and-groom-surrounded-by-their-friends-66abb2eac5cde.jpg?crop=0.8893081761006288xw:1xh;center,top&resize=1200:*",
    tagline: "Celebrate Love with Friends and Family",
  },
  {
    url: "https://6564114.fs1.hubspotusercontent-na1.net/hubfs/6564114/Year%20end%20events%20-%20Interprefy.jpg",
    tagline: "Unforgettable Moments, Year-End Magic",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnclkX4VXEfdXuMNFbK8tLoQc15IFkosUScA&s",
    tagline: "Professional Gatherings, Lasting Connections",
  },
];

const eyeclosed = "https://www.svgrepo.com/show/380007/eye-password-hide.svg";
const eyeopen = "https://www.svgrepo.com/show/380010/eye-password-show.svg";

const SignUp = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState([]);
  const navigate = useNavigate();

  // state to collect form fields
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const dialogRef = useRef();

  const openDialog = () => dialogRef.current?.showModal();
  const closeDialog = () => dialogRef.current?.close();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // <-- this is your payload
    createUser(formData)
      .then((res) => {
        console.log(" created user:", res.data);
        setUserId(res.data?.data.userId);
        setShowModal(true);
        close();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="border rounded-[8px] h-[600px] w-[880px] text-white box-border overflow-hidden mx-auto mt-[60px]">
      <div className="container flex  h-full">
        {/* -------- LEFT SECTION (CAROUSEL / IMAGES) -------- */}
        <div className="picture-side w-[50%] relative justify-center">
          <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
            <span>logo</span>
            <button className="bg-white opacity-60 px-2 py-1 rounded-[4px] text-black font-semibold text-[14px] cursor-pointer hover:bg-[#1d192d] hover:text-white">
              Back to website →
            </button>
          </div>

          <div className="carousel absolute top-0 h-full object-cover z-0">
            {images.map(
              (img, index) =>
                img.url && (
                  <div
                    key={index}
                    className={`${
                      index === activeIndex ? "block" : "hidden"
                    } h-full z-0`}
                  >
                    <img
                      src={img.url}
                      className="h-full w-full brightness-75"
                    />
                    <div className="absolute bottom-24 left-4 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.7)] text-white p-2 rounded text-[24px]">
                      {img.tagline}
                    </div>
                  </div>
                )
            )}
          </div>

          <div className="btn-container absolute bottom-10 left-[34%]  z-20 flex gap-2  justify-center items-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${
                  activeIndex === i
                    ? "border border-gray-200"
                    : "border-blue-500"
                } border-t-8 w-[40px]`}
                onClick={() => setActiveIndex(i)}
              ></div>
            ))}
          </div>
        </div>

        {/* -------- RIGHT SECTION (FORM) -------- */}
        <div className="create-side w-[55%] bg-[#1c1a41] h-full px-8 ">
          <h1 className="text-[32px] font-semibold text-white mt-[120px]">
            Create an account
          </h1>
          <p className="text-gray-500 text-[14px] pb-[16px] mb-[32px]">
            Already have an account?{" "}
            <span
              className="underline cursor-pointer text-blue-400 hover:text-blue-500"
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </span>
          </p>

          <form
            className="w-[97%] flex flex-col gap-[16px]"
            onSubmit={handleSubmit}
            method="POST"
          >
            <div className="flex name-container gap-2">
              <input
                className="border border-gray-400 rounded px-2 py-1 w-[80%]"
                placeholder="First name"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
              <input
                className="border border-gray-400 rounded px-2 py-1"
                placeholder="Last name"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </div>

            <div className="rounded px-2 py-1 border border-gray-500  text-start">
              <input
                type="email"
                placeholder=" email"
                className="w-full focus:outline-none"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex rounded px-2 py-1 border border-gray-500 justify-between bg-white text-gray-900">
              <input
                className="focus:outline-none w-full"
                placeholder="Enter your password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img
                  src={showPassword ? eyeopen : eyeclosed}
                  className="h-4 w-4 bg-white"
                  alt="Toggle visibility"
                />
              </button>
            </div>

            <div className="terms flex">
              <input type="checkbox" required />
              <p className="text-[12px] pl-2">
                I agree to the{" "}
                <span
                  className="underline text-blue-500 cursor-pointer"
                  onClick={openDialog}
                >
                  Terms & Conditions
                </span>
              </p>
            </div>
            <button
              type="submit"
              className="border rounded-[8px] py-2 bg-[#090128] border-transparent opacity-80 cursor-pointer hover:bg-blue-700"
            >
              Create account
            </button>
          </form>
          {showModal && (
            <TokenPage
              userId={userId}
              token=""
              onClickHandler={() => setShowModal(!setShowModal)}
            ></TokenPage>
          )}
        </div>
      </div>

      {/* -------- TERMS MODAL -------- */}
      <dialog ref={dialogRef} className="rounded-lg p-4 max-w-md w-full">
        <h2 className="text-lg font-bold mb-2">{termsData.title}</h2>
        <div className="text-sm space-y-2 max-h-[250px] overflow-y-auto">
          {termsData.items.map((t, index) => (
            <div key={index} className="text-start">
              <p>
                <strong>
                  {index + 1} {t.heading}
                </strong>
              </p>
              <p>{t.body}</p>
            </div>
          ))}
        </div>
        <p className="text-start text-[12px] font-semibold py-2">
          updated last: {termsData.updatedAt}
        </p>
        <form method="dialog" className="mt-4 text-right">
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded"
            onClick={closeDialog}
          >
            Close
          </button>
        </form>
      </dialog>
    </div>
  );
};

export default SignUp;
