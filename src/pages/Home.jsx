
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';



const Home = () => {
    const [menuActive, setMenuActive] = useState(false);

    // Toggle nav menu on menu button click
    const toggleMenu = () => {
        setMenuActive((prev) => !prev);
    };
    // Close menu on scroll
    useEffect(() => {
        const handleScroll = () => {
            setMenuActive(false);
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup on unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (
        <>
            <header className="header">
                <Link to="/" className="logo">
                    <i className="fas fa-heartbeat"></i>LifeLine HMS
                </Link>
                <nav className={`nav ${menuActive ? "active" : ""}`}>
                    <a href="#home">home</a>
                    <a href="#service">service</a>
                    <a href="#aboutus">aboutUs</a>
                    <a href="#doctor">doctor</a>
                    <a href="#bookapp">bookApp</a>
                    <Link to="/login">login/signUp</Link>
                </nav>
                {/* <div className="fas fa-bars" id="menubtn"></div> */}
                <div
                    className="fas fa-bars"
                    id="menubtn"
                    onClick={toggleMenu}
                ></div>
            </header>

            <section className="home" id="home">
                <div className="img">
                    <img
                        src="cartoon3.png"
                        alt="Hospital"

                    />
                </div>
                <div className="container">
                    <h3>stay healthy stay safe</h3>
                   <p>Book your appointment with trusted doctors in just one click.</p>
                    <a href="#" className="btn">
                        contactUs <span className="fas fa-chevron-right"></span>
                    </a>
                </div>
            </section>

            <section className="icons-container">
                {[
                    { count: '140+', label: 'doctors at work' },
                    { count: '1040+', label: 'satisfied patients' },
                    { count: '500+', label: 'bed facility' },
                    { count: '80+', label: 'available hospitals' },
                ].map((item, idx) => (
                    <div className="icons" key={idx}>
                        <i className="fas fa-users"></i>
                        <h3>{item.count}</h3>
                        <p>{item.label}</p>
                    </div>
                ))}
            </section>

           <section className="service" id="service"> 
  <h1 className="heading">
    our <span>services</span>
  </h1>
  <div className="box-container">
    {[
      {
        icon: "fas fa-notes-medical",
        title: "Free Checkups",
        desc: "Comprehensive health checkups to ensure your well-being."
      },
      {
        icon: "fas fa-ambulance",
        title: "24/7 Ambulance",
        desc: "Emergency ambulance services available anytime, anywhere."
      },
      {
        icon: "fas fa-user-md",
        title: "Expert Doctors",
        desc: "Consult with highly qualified and experienced doctors."
      },
      {
        icon: "fas fa-pills",
        title: "Medicines",
        desc: "Pharmacy with a wide range of trusted medicines on-site."
      },
      {
        icon: "fas fa-procedures",
        title: "Bed Facility",
        desc: "Modern and comfortable inpatient facilities available."
      },
      {
        icon: "fas fa-heartbeat",
        title: "Total Care",
        desc: "Personalized healthcare with a patient-first approach."
      }
    ].map((service, idx) => (
      <div className="box" key={idx}>
        <i className={service.icon}></i>
        <h3>{service.title}</h3>
        <p>{service.desc}</p>
        <a href="#" className="btn">
          Learn More <span className="fas fa-chevron-right"></span>
        </a>
      </div>
    ))}
  </div>
</section>


            <section className="about" id="aboutus">
                <h1 className="heading">
                    <span>about</span> us
                </h1>
                <div className="row">
                    <div className="img">
                        <img
                            src="lady_doc.jpg"
                            alt="Hospital"
                        />
                    </div>
                    <div className="content">
                        <h3>we take care of your HEALTHY LIFE</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
                        <a href="#" className="btn">
                            learn more <span className="fas fa-chevron-right"></span>
                        </a>
                    </div>
                </div>
            </section>

            {/* <section className="doctor" id="doctor">
                <h1 className="heading">
                    our<span>doctors</span>
                </h1>
                <div className="box-container">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div className="box" key={i}>
                            <div className="img">
                                <img
                                    src="cartoon3.png"
                                    alt="Hospital"

                                />
                            </div>
                            <h3>john deo</h3>
                            <span>expert doctor</span>
                            <div className="share">
                                <a href="#" className="fab fa-facebook"></a>
                                <a href="#" className="fab fa-twitter"></a>
                                <a href="#" className="fab fa-instagram"></a>
                                <a href="#" className="fab fa-linkedin"></a>
                            </div>
                        </div>
                    ))}
                </div>
            </section> */}

            <section className="doctor" id="doctor">
                <h1 className="heading">
                    our<span>doctors</span>
                </h1>
                <div className="box-container">
                    <div className="box">
                        <img src="m_doc3.jpg" alt="" />

                        <h3>jonh deo</h3>
                        <span>Emergency Medicine Specialist</span>
                        <div className="share">
                            <a href="#" className="fab fa-facebook"></a>
                            <a href="#" className="fab fa-twitter"></a>
                            <a href="#" className="fab fa-instagram"></a>
                            <a href="#" className="fab fa-linkedin"></a>
                        </div>
                    </div>

                    <div className="box">
                        <img src="male_doc.jpg" alt="" />
                        <h3>Dr. Noah Greene</h3>
                        <span>Orthopedic Surgeon</span>
                        <div className="share">
                            <a href="#" className="fab fa-facebook"></a>
                            <a href="#" className="fab fa-twitter"></a>
                            <a href="#" className="fab fa-instagram"></a>
                            <a href="#" className="fab fa-linkedin"></a>
                        </div>
                    </div>

                    <div className="box">
                        <img src="f_doc2.jpg" alt="" />
                        <h3>Dr. Maya Ellison</h3>
                        <span>Neurologist</span>
                        <div className="share">
                            <a href="#" className="fab fa-facebook"></a>
                            <a href="#" className="fab fa-twitter"></a>
                            <a href="#" className="fab fa-instagram"></a>
                            <a href="#" className="fab fa-linkedin"></a>
                        </div>
                    </div>

                    <div className="box">
                        <img src="male_DOC (2).jpg" alt="" />
                        <h3>Dr. Raj Mehta</h3>
                        <span>Pediatrician</span>
                        <div className="share">
                            <a href="#" className="fab fa-facebook"></a>
                            <a href="#" className="fab fa-twitter"></a>
                            <a href="#" className="fab fa-instagram"></a>
                            <a href="#" className="fab fa-linkedin"></a>
                        </div>
                    </div>

                    <div className="box">
                        <img src="f_dpc.jpg" alt="" />
                        <h3>Dr. Sophia Bennett</h3>
                        <span>Plastic Surgeon</span>
                        <div className="share">
                            <a href="#" className="fab fa-facebook"></a>
                            <a href="#" className="fab fa-twitter"></a>
                            <a href="#" className="fab fa-instagram"></a>
                            <a href="#" className="fab fa-linkedin"></a>
                        </div>
                    </div>

                    <div className="box">
                        <img src="fav_m_doc.jpg" alt="" />
                        <h3>Dr. Luca Romano </h3>
                        <span>Dermatologist</span>
                        <div className="share">
                            <a href="#" className="fab fa-facebook"></a>
                            <a href="#" className="fab fa-twitter"></a>
                            <a href="#" className="fab fa-instagram"></a>
                            <a href="#" className="fab fa-linkedin"></a>
                        </div>
                    </div>
                </div>
            </section>


            <section className="book" id="bookapp">
                <h1 className="heading">
                    <span>book</span>now
                </h1>
                <div className="row">
                    <div className="img">
                        <img src="random_doc.jpg" alt="" />
                    </div>
                    <form action="">
                        <h3>book appointment</h3>
                        <input type="text" placeholder="enter your name" className="box" />
                        <input type="number" placeholder="enter your number" className="box" />
                        <input type="email" placeholder="enter your email" className="box" />
                        <input type="date" placeholder="enter date" className="box" />
                        <input type="submit" value="book now" className="btn" />
                    </form>
                </div>
            </section>

            <section className="footer">

                <div className="box-container">

                    <div className="box">
                        <h3>quick links</h3>
                        <a href="##home"><i className="fas fa-chevron-right"></i>home</a>
                        <a href="#service"><i className="fas fa-chevron-right"></i>service</a>
                        <a href="#aboutus"><i className="fas fa-chevron-right"></i>aboutus</a>
                        <a href="#doctors"><i className="fas fa-chevron-right"></i>doctors</a>
                        <a href="#bookapp"><i className="fas fa-chevron-right"></i>bookapp</a>
                    </div>
                    <div className="box">
                        <h3>our services</h3>
                        <a href="#"><i className="fas fa-chevron-right"></i>dental care</a>
                        <a href="#"><i className="fas fa-chevron-right"></i>massage therapy</a>
                        <a href="#"><i className="fas fa-chevron-right"></i>cardioloty</a>
                        <a href="#"><i className="fas fa-chevron-right"></i>diagnosis</a>
                        <a href="#"><i className="fas fa-chevron-right"></i>ambulance service</a>
                    </div>
                    <div className="box">
                        <h3>quick links</h3>
                        <a href="#"><i className="fas fa-phone"></i>+123-456-7890</a>
                        <a href="#"><i className="fas fa-phone"></i>+111-222-3333</a>
                        <a href="#"><i className="fas fa-envelope"></i>nandani@gmail.com</a>
                        <a href="#"><i className="fas fa-envelope"></i>vijay@gmail.com</a>
                        <a href="#"><i className="fas fa-map-marker-alt"></i>ahemdabad, india -400104</a>
                    </div>

                    <div className="box">
                        <h3>follow us</h3>
                        <a href="#"><i className="fas fa-facebook-f"></i>facebook</a>
                        <a href="#"><i className="fas fa-instagram"></i>instagram</a>
                        <a href="#"><i className="fas fa-twitter"></i>twitter</a>
                        <a href="#"><i className="fas fa-linkedin"></i>linkedin</a>
                    </div>
                    <div class="credit">created by <span>  ms.Nandani </span>|all right reserve |</div>

                </div>

            </section>
        </>
    );
};

export default Home;