import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";

interface Props {
  encodedImage: string;
  altText: string;
  caption?: string;
}

const useStyles = makeStyles({
  image: {
    height: 140,
    width: 140,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  imageCaption: {
    marginTop: 4,
  },
});

const ImageElement: React.FC<Props> = ({ encodedImage, altText, caption }) => {
  const { image, container, imageCaption } = useStyles();

  return (
    <div className={container}>
      <img
        className={image}
        src={`data:image/png;base64,${encodedImage}`}
        alt={altText}
      />
      <Typography classes={{ root: imageCaption }}>
        {/* Hacky but works */}
        {caption != null ? caption : "\u00a0"}
      </Typography>
    </div>
  );
};

export default ImageElement;
