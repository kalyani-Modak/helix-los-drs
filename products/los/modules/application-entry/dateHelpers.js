import dayjs from "dayjs";

/** HDatePicker is backed by AdapterDayjs, so it needs a dayjs instance or null. */
export const toPickerValue = (value) => {
  if (!value) return null;
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
};

/** Form state keeps plain ISO dates so the payload stays JSON friendly. */
export const fromPickerValue = (value) => {
  if (!value) return "";
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("YYYY-MM-DD") : "";
};
