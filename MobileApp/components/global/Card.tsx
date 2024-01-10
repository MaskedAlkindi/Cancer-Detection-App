import { TouchableOpacity } from "react-native";
import { BoldText, RegularText } from "./StyledText";

type CardProps = {
  component: UIComponentsListType;
  onPress: () => void;
};

export default function Card({ component, onPress }: CardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "transparent",
        borderColor: "#d3d3d3",
        borderWidth: 0.5,
        width: "100%",
        padding: 20,
        borderRadius: 4,
        alignItems: "flex-start",
        justifyContent: "center",
        gap: 8,
      }}
    >
      <BoldText style={{ color: "#000" }}>{component.name}</BoldText>
      <RegularText style={{ color: "#000", fontSize: 12 }}>
        {component.description}
      </RegularText>
    </TouchableOpacity>
  );
}
