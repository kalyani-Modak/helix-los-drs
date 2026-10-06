const VerifyLink = ({ isValid, onVerify }) => (
  <a
    href="#"
    aria-disabled={!isValid}
    tabIndex={isValid ? 0 : -1}
    onClick={(event) => {
      event.preventDefault();
      if (isValid) onVerify?.();
    }}
    style={{
      pointerEvents: isValid ? "auto" : "none",
      opacity: isValid ? 1 : 0.7,
      whiteSpace: "nowrap",
      cursor: "pointer",
      textDecoration: "none",
      fontSize: "12px",
      marginTop: "4px",
    }}
    onMouseEnter={(event) => {
      if (isValid) event.currentTarget.style.textDecoration = "underline";
    }}
    onMouseLeave={(event) => {
      event.currentTarget.style.textDecoration = "none";
    }}
  >
    Verify
  </a>
);

export default VerifyLink;