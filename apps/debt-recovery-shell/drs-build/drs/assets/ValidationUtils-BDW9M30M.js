import { dB as jsxRuntimeExports } from "./index-BhdgJqva.js";
function handleValidationErrors(intl, toast, responseJson) {
  if (responseJson && typeof responseJson === "object") {
    const validationMessages = [];
    Object.entries(responseJson).forEach(([field, messageKey]) => {
      const cleanKey = messageKey.replace(/[{}]/g, "");
      const translatedMessage = intl.formatMessage({ id: cleanKey });
      validationMessages.push(translatedMessage);
    });
    if (validationMessages.length > 0) {
      const groupedMessage = /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: validationMessages.map((msg, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        "• ",
        msg
      ] }, index)) });
      toast.error(groupedMessage);
    }
  }
}
export {
  handleValidationErrors as h
};
