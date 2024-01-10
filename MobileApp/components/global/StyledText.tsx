import { Text, TextProps } from "react-native";

export function ExtraBoldText(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "InterExtraBold" }]} />
  );
}

export function BoldText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: "InterBold" }]} />;
}

export function RegularText(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "InterRegular" }]} />
  );
}

export function HeadingText(props: TextProps) {
  return (
    <Text
      {...props}
      style={[props.style, { fontFamily: "InterExtraBold", fontSize: 28 }]}
    />
  );
}

export function SubHeadingText(props: TextProps) {
  return (
    <Text
      {...props}
      style={[props.style, { fontFamily: "InterBold", fontSize: 18 }]}
    />
  );
}
