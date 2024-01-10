import { View, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { convertToLogo } from "../../utils/convertToLogo";
import { BoldText, RegularText } from "../global";

export default function SocialCard({
  id,
  type,
  username,
  url,
}: SocialCardType) {
  return (
    <TouchableOpacity
      key={id}
      onPress={() => url && Linking.openURL(url)}
      style={{
        backgroundColor: "transparent",
        borderColor: "#d3d3d3",
        borderWidth: 0.5,
        width: "48%",
        padding: 20,
        borderRadius: 4,
        alignItems: "flex-start",
        justifyContent: "center",
        gap: 8,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <Ionicons name={convertToLogo(type)} size={20} color={"#000"} />
        <BoldText style={{ color: "#000" }}>{type}</BoldText>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <RegularText
          style={{
            color: "#000",
            fontSize: 12,
            textDecorationLine: "underline",
          }}
        >
          {username}
        </RegularText>
        <Ionicons
          name="arrow-up-outline"
          size={14}
          color={"#d3d3d3"}
          style={{
            transform: [{ rotate: "45deg" }],
          }}
        />
      </View>
    </TouchableOpacity>
  );
}
