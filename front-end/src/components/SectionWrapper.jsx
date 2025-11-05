const SectionWrapper = ({ title, Icon, children }) => {
  return (
    <div className="section-container card">
      <div className="section-header">
        {Icon && <Icon size="40px" />}
        <h3>{title}</h3>
      </div>
      <div className="section-novels">{children}</div>
    </div>
  );
};

export default SectionWrapper;
