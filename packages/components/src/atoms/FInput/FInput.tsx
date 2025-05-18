import { Box, TextField, TextFieldProps } from "@mui/material";

interface InputProps {
  options?: TextFieldProps;
  textposition: "left" | "center";
  maxWidth?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FInput({
  options,
  textposition,
  maxWidth,
  onChange,
}: InputProps) {
  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": {
          width: "100%",
          margin: "auto",
          maxWidth: maxWidth,
        },
      }}
      noValidate
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <TextField
        {...options}
        id="outlined-basic"
        variant="outlined"
        slotProps={{
          input: {
            sx: {
              "& input": {
                textAlign: textposition,
                backgroundColor: "#FFFFFF",
                color: "var(--mui-palette-primary-main)",
                borderColor: "var(--mui-palette-primary-main)",
                borderRadius: "8px",
                borderWidth: 1,
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "var(--mui-palette-primary-main)",
                borderRadius: "8px",
                borderWidth: 2,
              },
              "& input::placeholder": {
                color: "var(--mui-palette-primary-main)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "var(--mui-palette-primary-main)",
                borderWidth: 3,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "var(--mui-palette-primary-main)",
                borderWidth: 3,
              },
              "&.Mui-focused:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "var(--mui-palette-primary-main)",
                borderWidth: 3,
              },
              "&.Mui-focused:not(:hover):not(:focused) .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "var(--mui-palette-primary-main)",
                  borderWidth: 3,
                },
            },
          },
        }}
        onChange={onChange}
      />
    </Box>
  );
}
