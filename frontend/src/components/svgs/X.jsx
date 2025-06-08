
const XSvg = ({ className }) => {
	return (
	  <img
		src="\Logo.png" // Since it's in the public folder, this is the correct path
		alt="Ecosafe Logo"
		className={`w-24 lg:w-2/3 ${className}`} // Adjust size based on screen width
	  />
	);
  };
  
  export default XSvg;
  