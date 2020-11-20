import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";

interface Props {
  encodedImage: string;
  altText: string;
  label: string;
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
  imageLabel: {
    marginBottom: 8,
  },
  imageCaption: {
    marginTop: 4,
  },
});

const ImageRowElement: React.FC<Props> = ({
  encodedImage,
  altText,
  label,
  caption,
}) => {
  const { image, container, imageLabel, imageCaption } = useStyles();

  return (
    <div className={container}>
      <Typography classes={{ root: imageLabel }} variant="h6">
        {label}
      </Typography>
      <img
        className={image}
        src={`data:image/png;base64,${encodedImage}`}
        alt={altText}
      />
      {caption != null && (
        <Typography classes={{ root: imageCaption }}>{caption}</Typography>
      )}
    </div>
  );
};

export default ImageRowElement;
