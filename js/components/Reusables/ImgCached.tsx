import React from "react";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  cachedSize?: { w: number; h: number };
}

const ImgCached = (props: Props) => {
  const { cachedSize, ...imgProps } = props;
  const cdnUrl = "images.weserv.nl";
  let url = `//${cdnUrl}/?url=${props.src}`;
  if (props.cachedSize.h || props.cachedSize.h)
    url = url.concat(`&h=${props.cachedSize.h}&w=${props.cachedSize.w}`);

  return <img {...imgProps} src={url}></img>;
};

export default ImgCached;
