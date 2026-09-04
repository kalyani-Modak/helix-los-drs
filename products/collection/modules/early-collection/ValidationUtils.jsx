
/**
 * Handles validation errors from API response and displays them as toast messages.
 * @param {object} intl - React Intl instance.
 * @param {object} toast - Toast instance.
 * @param {object} responseJson - The responseJson from API containing validation errors.
 */
export function handleValidationErrors(intl, toast, responseJson) {
  if (responseJson && typeof responseJson === "object") {
    const validationMessages = [];

    Object.entries(responseJson).forEach(([field, messageKey]) => {
      const cleanKey = messageKey.replace(/[{}]/g, "");
      const translatedMessage = intl.formatMessage({ id: cleanKey });
      validationMessages.push(translatedMessage);
    });

    if (validationMessages.length > 0) {
      const groupedMessage = (
        <div>
          {validationMessages.map((msg, index) => (
            <div key={index}>• {msg}</div>
          ))}
        </div>
      );
      toast.error(groupedMessage);
    }
  }
}