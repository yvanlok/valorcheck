import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import React from "react";

type Props = {
  icon: "check" | "close";
  color?: string;
  message: string;
};

const StatusMessage: React.FC<Props> = ({
  icon,
  color = "inherit",
  message,
}) => {
  const renderIcon = () => {
    switch (icon) {
      case "check":
        return <CheckIcon sx={{ color, marginRight: "8px" }} />;
      case "close":
        return <CloseIcon sx={{ color, marginRight: "8px" }} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {renderIcon()}
      <Typography
        sx={{
          fontFamily: "Roboto",
          textAlign: "center",
          fontSize: "20",
        }}
      >
        {message}
      </Typography>
    </div>
  );
};

export default StatusMessage;
