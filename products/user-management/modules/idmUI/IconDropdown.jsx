import { useState, useEffect } from "react";
import { MenuItem, Select, FormControl, ListItemIcon } from "@mui/material";

// Load images from @images using Vite 5 syntax
const imageMap = import.meta.glob("@images/*.{png,jpg,jpeg,svg}", {
  eager: true,
  import: "default",
  query: "?url",
});

const imageOptions = Object.entries(imageMap).map(([path, url]) => ({
  name: path.split("/").pop(), // extract filename
  url,
}));

const IconDropdown = ({ value, onChange }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    setImages(imageOptions); // already resolved URLs
  }, []);

  return (
    <FormControl fullWidth>
      <Select
        variant="standard"
        value={value}
        onChange={onChange}
        displayEmpty
      >
        <MenuItem value="" disabled>
          Select Icon
        </MenuItem>
        {images.map(({ name, url }) => (
          <MenuItem key={name} value={url}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <img src={url} alt={name} width={20} height={20} />
            </ListItemIcon>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default IconDropdown;
