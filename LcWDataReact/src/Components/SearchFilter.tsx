import { Box, TextField, Button, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

interface Props {
  onSearch: (query: string) => void;
}

export default function SearchFilter({ onSearch }: Props) {
  const [searchText, setSearchText] = useState("");

  const handleFilterClick = () => {
    onSearch(searchText);
  };

  return (
    <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
      <TextField
        fullWidth
        placeholder="Ara"
        size="small"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#9e9e9e" }} />
            </InputAdornment>
          ),
        }}
        sx={{
          backgroundColor: "#fff",
          borderRadius: 1,
        }}
      />

      <Button
        variant="contained"
        onClick={handleFilterClick}
        sx={{
          backgroundColor: "#333",
          color: "white",
          fontWeight: 500,
          px: 2.5,
          "&:hover": {
            backgroundColor: "#222",
          },
        }}
      >
        Filtrele
      </Button>
    </Box>
  );
}
