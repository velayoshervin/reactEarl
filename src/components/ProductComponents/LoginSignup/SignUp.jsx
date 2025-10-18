import "./SignUp.css";
import { React, useState, useRef, useEffect } from "react";
// import { createUser } from "../../ItemsAxios";
import { createUser } from "../../../ItemsAxios";
import TokenPage from "../../NewsFeedComponents/TokenPage";
import { useNavigate } from "react-router-dom";
import slogo from "../../../assets/Slogo.png";

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
    console.log(formData);
    createUser(formData)
      .then((res) => {
        console.log("created user:", res.data);
        setUserId(res.data?.data.userId);
        setShowModal(true);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        {/* -------- LEFT SECTION (CAROUSEL) -------- */}
        <div className="signup-left">
          <img src={slogo} alt="Silvestre Logo" className="logo-image" />

          <button onClick={() => navigate("/")} className="back-button">
            Back to website →
          </button>

          <div className="carousel">
            {images.map((img, index) => (
              <div
                key={index}
                className={`carousel-slide ${
                  index === activeIndex ? "active" : ""
                }`}
              >
                <img src={img.url} className="carousel-image" alt="slide" />
                <div className="carousel-tagline">{img.tagline}</div>
              </div>
            ))}
          </div>

          <div className="carousel-controls">
            {images.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${
                  index === activeIndex ? "active" : ""
                }`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* -------- RIGHT SECTION (FORM) -------- */}
        <div className="signup-right">
          <div className="signup-header">
            <h1>Create an account</h1>
            <p className="signup-subtitle">
              Already have an account?{" "}
              <span onClick={() => navigate("/login")}>Login</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} method="POST">
            <div className="name-container">
              <input
                placeholder="First name"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
              <input
                placeholder="Last name"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </div>

            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="password-container">
              <input
                className="password-input"
                placeholder="Enter your password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img
                  src={showPassword ? eyeopen : eyeclosed}
                  alt="Toggle visibility"
                />
              </button>
            </div>

            <div className="terms-container">
              <input type="checkbox" className="terms-checkbox" required />
              <p className="terms-text">
                I agree to the{" "}
                <span className="terms-link" onClick={openDialog}>
                  Terms & Conditions
                </span>
              </p>
            </div>

            <button type="submit" className="submit-btn">
              Create account
            </button>
          </form>

          {showModal && (
            <TokenPage
              userId={userId}
              token=""
              onClickHandler={() => setShowModal(!showModal)}
            />
          )}
        </div>
      </div>

      {/* -------- TERMS MODAL -------- */}
      <dialog ref={dialogRef} className="terms-modal">
        <h2>{termsData.title}</h2>
        <div className="terms-content">
          {termsData.items.map((t, index) => (
            <div key={index} className="terms-item">
              <strong>
                {index + 1}. {t.heading}
              </strong>
              <p>{t.body}</p>
            </div>
          ))}
        </div>
        <p className="terms-updated">Updated last: {termsData.updatedAt}</p>
        <form method="dialog" className="text-right">
          <button className="modal-close-btn" onClick={closeDialog}>
            Close
          </button>
        </form>
      </dialog>
    </div>
  );
};

export default SignUp;
