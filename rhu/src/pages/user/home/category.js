import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IndividualSvg from "../../../assets/svg/individual.svg";
import FamilySvg from "../../../assets/svg/family.svg";
import InstitutionSvg from "../../../assets/svg/institution.svg";
import { motion } from "framer-motion";
import { updateCategory } from "../../../api/data";
import Swal from "sweetalert2";

const UserCategory = ({ onSelectCategory = () => {} }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const categoryData = userData.category || null;
    if (categoryData) {
      navigate('/gender');
    }
  }, [navigate]);

  const handleCategorySelect = async (label) => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
  
    if (!userData?.user?.category) {
      try {
        const user_id = userData?.user_id; // Ensure correct path to user_id
        if (!user_id) {
          console.error("User ID not found");
          return;
        }
  
        const response = await updateCategory(user_id, label);
  
        if (response.status === "success") {
          localStorage.setItem("user", JSON.stringify(response.user));
          
          if (!sessionStorage.getItem('shownReloginNotice')) {
            await Swal.fire({
              title: 'Please Relogin',
              text: 'For security, please login again. This will only occur once',
              icon: 'info'
            });
            sessionStorage.setItem('shownReloginNotice', 'true');
            window.location.href = '/';
          } else {
            window.location.href = '/';
          }
        } else {
          console.error(response.message);
        }
      } catch (error) {
        console.error("Failed to update category:", error);
      }
    } else {
      navigate("/gender");
    }
  };  

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="category">
      <motion.div
        className="category-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3>Select Your Category</h3>
      </motion.div>

      <motion.div
        className="category-grid"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {[{ img: IndividualSvg, label: 'Individual' },
          { img: FamilySvg, label: 'Family' },
          { img: InstitutionSvg, label: 'Institution' }].map(({ img, label }, index) => (
          <motion.div
            key={index}
            className="item"
            data-label={label}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleCategorySelect(label)} // Directly handle click
          >
            <div>
              <img src={img} alt={label}/>
              <span>{label}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default UserCategory;