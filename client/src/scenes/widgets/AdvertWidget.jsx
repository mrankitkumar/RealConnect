import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Sponsored
        </Typography>
        <Typography color={medium}>Create Ad</Typography>
      </FlexBetween>
      <img
        src={"http://localhost:3001/assets/adv.jpeg"}
        width="100%"
        height="auto"
        alt="advert"
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      />
      <FlexBetween>
        <Typography color={main}>Business</Typography>
        <Typography color={medium}>Business.com</Typography>
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
        Business News:Read latest Business News headlines,LIVE share market news and updates,financial,economic and banking news from india and other country.
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
